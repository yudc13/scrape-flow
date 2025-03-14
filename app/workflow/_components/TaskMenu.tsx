'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { TaskType } from '@/types/task';
import React from 'react';

const TaskMenu = () => {
	return (
		<aside className={'w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'}>
			<Accordion type={'multiple'} className={'w-full'} defaultValue={['extraction']}>
				<AccordionItem value={'extraction'}>
					<AccordionTrigger className={'font-bold'}>Extraction Data</AccordionTrigger>
					<AccordionContent className={'flex flex-col gap-1'}>
						<TaskMenuBtn taskType={TaskType.PAGE_TO_HTML}/>
						<TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT}/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	);
};

function TaskMenuBtn({taskType}: { taskType: TaskType }) {
	const task = TaskRegistry[taskType];

	const onDragStart = (event: React.DragEvent, type: TaskType) => {
		event.dataTransfer.setData('application/flow', type);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<Button
			variant={'secondary'}
			className={'w-full flex justify-between items-center gap-2'}
			draggable
			onDragStart={(e) => onDragStart(e, taskType)}
		>
			<div className={'flex items-center gap-2'}>
				<task.icon/>
				{task.label}
			</div>
		</Button>
	);
}

export default TaskMenu;