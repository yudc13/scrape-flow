'use server'

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getWorkflowPhaseDetails(phaseId: string) {
	const {userId} = await auth()
	if (!userId) {
		return null;
	}
	return prisma.executionPhase.findUnique({
		where: {
			id: phaseId,
			userid: userId,
		},
		include: {
			logs: {
				orderBy: {
					timestamp: 'desc'
				}
			}
		}
	})
}