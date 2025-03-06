'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GetWorkflowsForUser() {
	const {userId} = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	return prisma.workflow.findMany({
		where: {
			userid: userId,
		},
		orderBy: {
			createAt: 'desc',
		},
	});
}