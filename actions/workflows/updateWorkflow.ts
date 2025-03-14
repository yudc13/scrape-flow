'use server'

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateWorkflow(form: {workflowId: string, workflowDefinition: string}) {

	const {userId} = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: form.workflowId,
			userid: userId,
		}
	})

	if (!workflow) {
		throw new Error('Workflow not found');
	}

	await prisma.workflow.update({
		where: {
			id: form.workflowId,
			userid: userId,
		},
		data: {
			definition: form.workflowDefinition,
		}
	})

	revalidatePath('/workflows')
}