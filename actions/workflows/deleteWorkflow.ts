'use server'
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function deleteWorkflow(id: string) {
	const {userId} = await auth()

	if (!userId) {
		throw new Error('Unauthorized');
	}

	await prisma.workflow.delete({
		where: {
			userid: userId,
			id
		}
	})

	revalidatePath('/workflows')
}