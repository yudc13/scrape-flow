'use server';

import { prisma } from '@/lib/prisma';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { createWorkflowSchema, CreateWorkflowSchemaType } from '@/schema/workflow';
import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';
import { WorkflowStatus } from '@/types/workflow';
import { auth } from '@clerk/nextjs/server';
import { Edge } from '@xyflow/react';
import { redirect } from 'next/navigation';

export async function createWorkflow(form: CreateWorkflowSchemaType) {
	const {success, data} = createWorkflowSchema.safeParse(form);

	if (!success) {
		throw new Error('Invalid form data');
	}

	const {userId} = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const initialFlow: { nodes: AppNode[], edges: Edge[] } = {
		nodes: [],
		edges: []
	}

	// 设置入口节点
	initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER))

	const result = await prisma.workflow.create({
		data: {
			userid: userId,
			definition: JSON.stringify(initialFlow),
			status: WorkflowStatus.DRAFT,
			...data
		},
	});

	if (!result) {
		throw new Error('Failed to create workflow');
	}

	redirect(`/workflow/editor/${result.id}`)
}