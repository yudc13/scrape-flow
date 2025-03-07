'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { TaskType } from '@/types/task';
import { CoinsIcon, GripVerticalIcon } from 'lucide-react';

function NodeHeader({taskType}: { taskType: TaskType }) {
	const task = TaskRegistry[taskType]
	return (
		<div className={'flex items-center gap-2 p-2'}>
			<task.icon size={16} />
			<div className={'flex items-center justify-between w-full'}>
				<p className={'text-xs font-bold text-muted-foreground'}>{task.label}</p>
			</div>
			<div className={'flex gap-1 items-center'}>
				<Badge className={'gap-2 flex items-center text-xs'}>
					<CoinsIcon size={16} />
					TODO
				</Badge>
				<Button variant={'ghost'} size={'icon'} className={'drag-handle cursor-grab'}>
					<GripVerticalIcon size={20} />
				</Button>
			</div>
		</div>
	)
}

export default NodeHeader
