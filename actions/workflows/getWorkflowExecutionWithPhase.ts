'use server'

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getWorkflowExecutionWithPhase(executionId: string) {

	const {userId} = await auth()

	if (!userId) {
		throw new Error('Unauthorized');
	}

	return prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
			userid: userId
		},
		include: {
			phase: {
				orderBy: {
					number: 'asc'
				}
			}
		}
	})

}