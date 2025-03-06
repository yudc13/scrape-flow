'use server'

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getWorkflowById(workflowId: string) {

	const {userId} = await auth()
	if (!userId) {
		return null;
	}
	return prisma.workflow.findFirst({
		where: {
			userid: userId,
			id: workflowId
		}
	})
}