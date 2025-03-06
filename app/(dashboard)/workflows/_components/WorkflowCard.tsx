'use client';

import WorkflowAction from '@/app/(dashboard)/workflows/_components/WorkflowAction';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WorkflowStatus } from '@/types/workflow';
import { type Workflow } from '@prisma/client';
import { FileTextIcon, PlayIcon, ShuffleIcon } from 'lucide-react';
import Link from 'next/link';

const statusColor = {
	[WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
	[WorkflowStatus.PUBLISHED]: 'bg-primary',
};

const WorkflowCard = ({workflow}: { workflow: Workflow }) => {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;
	return (
		<Card
			className={'border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30'}>
			<CardContent className={'p-4 flex items-center justify-between h-[100px]'}>
				<div className={'flex justify-start items-center gap-4'}>
					<div
						className={cn('w-10 h-10 rounded-full flex items-center justify-center', statusColor[workflow.status as WorkflowStatus])}>
						{
							isDraft ? <FileTextIcon className={'w-5 h-5 stroke-white'}/> :
								<PlayIcon className={'h-5 w-5 stroke-white'}/>
						}
					</div>
					<div>
						<h3 className={'text-base text-muted-foreground font-bold flex items-center'}>
							<Link href={`/workflow/edit/${workflow.id}`} className={'flex items-center hover:underline'}>
								{workflow.name}
							</Link>
							{
								isDraft && <span
									className={'ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'}>草稿</span>
							}
						</h3>
					</div>
				</div>
				<div className={'flex items-center space-x-2'}>
					<Link href={`/workflow/edit/${workflow.id}`}
					      className={cn(buttonVariants({variant: 'outline', size: 'sm'}), 'flex items-center gap-2')}>
						<ShuffleIcon size={16}/>
						编辑
					</Link>
					<WorkflowAction workflow={workflow} />
				</div>
			</CardContent>
		</Card>
	);
};

export default WorkflowCard;