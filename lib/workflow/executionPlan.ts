import { AppNode, AppNodeMissingInputs } from '@/types/appNode'
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow'
import { Edge } from '@xyflow/react'
import { TaskRegistry } from './task/register'

export enum FlowToExecutionPlanValidationError {
	'NO_ENTRY_POINT',
	'INVALID_INPUTS',
}

type FlowToExecutionPlanType = {
	executionPlan?: WorkflowExecutionPlan
	error?: {
		type: FlowToExecutionPlanValidationError
		invalidElements?: AppNodeMissingInputs[]
	}
}

export function flowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {
	const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint)

	if (!entryPoint) {
		return {
			error: {
				type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
			},
		}
	}

	const inputsWithErrors: AppNodeMissingInputs[] = []
	// 标记已经执行的任务
	const planed = new Set<string>()

	const invalidInputs = getInvalidInputs(entryPoint, edges, planed)

	if (invalidInputs.length > 0) {
		inputsWithErrors.push({
			nodeId: entryPoint.id,
			inputs: invalidInputs,
		})
	}

	const executionPlan: WorkflowExecutionPlan = [
		{
			phase: 1,
			nodes: [entryPoint],
		},
	]

	planed.add(entryPoint.id)

	for (let phase = 2; phase <= nodes.length && planed.size < nodes.length; phase++) {
		const nextPhase: WorkflowExecutionPlanPhase = {
			phase,
			nodes: [],
		}

		// 遍历所有节点
		for (const currentNode of nodes) {
			// 该节点已经放入执行计划
			if (planed.has(currentNode.id)) {
				continue
			}

			const invalidInputs = getInvalidInputs(currentNode, edges, planed)
			if (invalidInputs.length > 0) {
				const incomers = getIncomers(currentNode, nodes, edges)

				if (incomers.every((incomer) => planed.has(incomer.id))) {
					console.log('invalid inputs', currentNode.id, invalidInputs)

					inputsWithErrors.push({
						nodeId: currentNode.id,
						inputs: invalidInputs,
					})
				} else {
					continue
				}
			}

			nextPhase.nodes.push(currentNode)
		}

		for (const node of nextPhase.nodes) {
			planed.add(node.id)
		}

		executionPlan.push(nextPhase)
	}

	if (inputsWithErrors.length > 0) {
		return {
			error: {
				type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
				invalidElements: inputsWithErrors,
			},
		}
	}

	return {
		executionPlan,
	}
}

function getInvalidInputs(node: AppNode, edges: Edge[], plan: Set<string>) {
	const invalidInputs = []
	const inputs = TaskRegistry[node.data.type].inputs

	for (const input of inputs) {
		const inputValue = node.data.inputs?.[input.name] || ''
		const inputValueProvide = inputValue?.length > 0
		if (inputValueProvide) {
			continue
		}

		const incomingEdges = edges.filter((edge) => edge.target === node.id)

		const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name)

		// 该输入是必填并且有输入并且输入已经处理过放入执行计划
		const requiredInputProvideByVisitedOutput =
			input.required && inputLinkedToOutput && plan.has(inputLinkedToOutput.source)

		if (requiredInputProvideByVisitedOutput) {
			continue
		} else if (!input.required) {
			// 如果输入不是必须的, 并且没有输出的edge连接
			if (!inputLinkedToOutput) {
				continue
			}
			if (inputLinkedToOutput && plan.has(inputLinkedToOutput.source)) {
				continue
			}
		}
		invalidInputs.push(input.name)
	}

	return invalidInputs
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
	if (!node.id) {
		return []
	}
	const incomersIds = new Set()

	for (const edge of edges) {
		if (edge.target === node.id) {
			incomersIds.add(edge.source)
		}
	}

	return nodes.filter((node) => incomersIds.has(node.id))

}
