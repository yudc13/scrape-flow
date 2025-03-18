import 'server-only';
import { createLogCollector } from '@/lib/log';
import { prisma } from '@/lib/prisma';
import { ExecutorRegister } from '@/lib/workflow/executor/register';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { AppNode } from '@/types/appNode';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LogCollector } from '@/types/log';
import { TaskParamType } from '@/types/task';
import { ExecutionPhaseStatus, WorkFlowExecutionStatus, WorkflowTask } from '@/types/workflow';
import { ExecutionPhase } from '@prisma/client';
import { Edge } from '@xyflow/react';
import { revalidatePath } from 'next/cache';
import { Page } from 'puppeteer';

export async function executeWorkflow(executionId: string) {
	const execution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
		},
		include: {
			workflow: true,
			phase: true,
		},
	});

	if (!execution) {
		throw new Error('Execution not found');
	}

	const environment: Environment = {phases: {}};

	await initializeWorkflowExecution(executionId, execution.workflowId);

	await initializePhaseStatuses(execution);

	let executionFailed = false;
	let creditsConsumed = 0;

	const edges = JSON.parse(execution.workflow.definition).edges as Edge[];

	const logCollector = createLogCollector()

	for (const phase of execution.phase) {
		const {success} = await executionWorkflowPhase(phase, environment, edges, logCollector);
		// 执行某一步失败 直接终止执行
		if (!success) {
			executionFailed = true;
			break
		}
	}

	await finalizeWorkflowExecution(
		executionId,
		execution.workflowId,
		creditsConsumed,
		executionFailed,
	);

	await clearUpEnvironment(environment);


	revalidatePath('/workflow/runs');
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
	// 修改执行状态
	await prisma.workflowExecution.update({
		where: {id: executionId},
		data: {
			startAt: new Date(),
			status: WorkFlowExecutionStatus.RUNNING,
		},
	});

	await prisma.workflow.update({
		where: {id: workflowId},
		data: {
			lastRunAt: new Date(),
			lastRunId: executionId,
			lastRunStatus: WorkFlowExecutionStatus.RUNNING,
		},
	});
}

async function initializePhaseStatuses(execution: any) {
	await prisma.executionPhase.updateMany({
		where: {
			id: {
				in: execution.phase.map((phase: any) => phase.id),
			},
		},
		data: {
			status: ExecutionPhaseStatus.PENDING,
		},
	});
}

async function finalizeWorkflowExecution(
	executionId: string,
	workflowId: string,
	creditsConsumed: number,
	executionFailed: boolean,
) {
	const finalStatus = executionFailed
		? WorkFlowExecutionStatus.FAILED
		: WorkFlowExecutionStatus.COMPLETED;

	await prisma.workflowExecution.update({
		where: {id: executionId},
		data: {
			status: finalStatus,
			completeAt: new Date(),
			creditsConsumed,
		},
	});

	await prisma.workflow
		.update({
			where: {id: workflowId, lastRunId: executionId},
			data: {
				lastRunStatus: finalStatus,
			},
		})
		.catch((err) => {
			// ignore
		});
}

async function executionWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], logCollector: LogCollector) {
	const startAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;

	await prisma.executionPhase.update({
		where: {id: phase.id},
		data: {
			status: ExecutionPhaseStatus.RUNNING,
			startAt,
			inputs: JSON.stringify(node.data.inputs),
		},
	});

	const creditsRequired = TaskRegistry[node.data.type].credits;

	// TODO: 扣除当前用户积分
	console.log('deduct credits', creditsRequired);

	// 真正执行工作流的每一项步骤
	const success = await executionPhase(phase, node, environment, edges, logCollector);

	const outputs = environment.phases[node.id].outputs;

	await finalizePhase(phase.id, success, outputs);

	return {success};

}

async function finalizePhase(phaseId: string, success: boolean, outputs: Record<string, string>) {

	const finalizeStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

	const completeAt = new Date();

	await prisma.executionPhase.update({
		where: {id: phaseId},
		data: {
			status: finalizeStatus,
			completeAt,
			outputs: JSON.stringify(outputs),
		},
	});
}

async function executionPhase(phase: ExecutionPhase, node: AppNode, environment: Environment, edges: Edge[], logCollector: LogCollector): Promise<boolean> {
	setupEnvironmentForPhase(node, environment, edges);

	const runFunc = ExecutorRegister[node.data.type];
	if (!runFunc) {
		return false;
	}

	const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

	return runFunc(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
	environment.phases[node.id] = {
		inputs: {},
		outputs: {},
	};
	const inputs = TaskRegistry[node.data.type].inputs;

	for (const input of inputs) {
		const inputValue = node.data.inputs?.[input.name] || '';
		if (input.type === TaskParamType.BROWSER_INSTANCE) {
			continue;
		}
		if (inputValue) {
			environment.phases[node.id].inputs[input.name] = inputValue;
			continue;
		}

		const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);
		if (!connectedEdge) {
			console.error(`No edge found for input ${input.name}`);
			continue;
		}

		environment.phases[node.id].inputs[input.name] = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
	}
}

function createExecutionEnvironment<T extends WorkflowTask>(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<T> {
	return {
		getInput: (name: string) => {
			return environment.phases[node.id]?.inputs[name];
		},
		setOutput(name: string, value: string) {
			environment.phases[node.id].outputs[name] = value;
		},
		setBrowser: (browser: any) => {
			environment.browser = browser;
		},
		getBrowser: () => {
			return environment.browser;
		},
		setPage: (page: Page) => {
			environment.page = page;
		},
		getPage() {
			return environment.page;
		},

		log: logCollector
	};
}

async function clearUpEnvironment(environment: Environment) {
	if (environment.browser) {
		await environment.browser.close().catch(e => {
			console.error('close browser error: ', e);
		});
	}
}