'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';
import { useReactFlow } from '@xyflow/react';
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react';

function NodeHeader({taskType, nodeId}: { taskType: TaskType, nodeId: string }) {
	const task = TaskRegistry[taskType]
	const {deleteElements, getNodes, getNode, addNodes} = useReactFlow()
	return (
		<div className={'flex items-center gap-2 p-2'}>
			<task.icon size={24} />
			<div className={'flex items-center justify-between w-full'}>
				<p className={'text-xs font-bold text-muted-foreground'}>{task.label}</p>
			</div>
			<div className={'flex gap-1 items-center'}>
				<Badge className={'gap-2 flex items-center text-xs'}>
					<CoinsIcon size={16} />
					TODO
				</Badge>
				<Button variant={'ghost'} size={'icon'} onClick={() => deleteElements({nodes: getNodes().filter(node => node.id === nodeId)})}>
					<TrashIcon size={12} />
				</Button>
				<Button variant={'ghost'} size={'icon'} onClick={() => {
					const node = getNode(nodeId) as AppNode
					const newX = node.position.x
					const newY = node.position.y + node.measured?.height! + 20
					const newNode = createFlowNode(node.data.type, {x: newX, y: newY})
					addNodes([newNode])
				}}>
					<CopyIcon size={12} />
				</Button>
				<Button variant={'ghost'} size={'icon'} className={'drag-handle cursor-grab'}>
					<GripVerticalIcon size={20} />
				</Button>
			</div>
		</div>
	)
}

export default NodeHeader
