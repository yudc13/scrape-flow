'use client'

import { ColorForHandle } from '@/app/workflow/_components/nodes/common'
import NodeParamField from '@/app/workflow/_components/nodes/NodeParamField'
import { useFlowVlidation } from '@/components/hooks/useFlowValidation'
import { cn } from '@/lib/utils'
import { TaskParam } from '@/types/task'
import { Handle, Position, useEdges } from '@xyflow/react'
import { ReactNode } from 'react'

export function NodeInputs({ children }: { children: ReactNode }) {
	return <div className={'flex flex-col gap-2 divide-y'}>{children}</div>
}

export function NodeInput({ input, nodeId }: { input: TaskParam; nodeId: string }) {
	// 判断该节点是否有连线
	const edges = useEdges()

	const { invalidInputs } = useFlowVlidation()

	const isConnected = edges.some(
		(edge) => edge.target === nodeId && edge.targetHandle === input.name
	)

	const hasErrors = invalidInputs
		.find((node) => node.nodeId === nodeId)
		?.inputs?.find((inValidInput) => inValidInput === input.name)

	return (
		<div
			className={cn(
				'relative flex justify-start p-3 bg-secondary w-full',
				hasErrors && 'bg-destructive/30'
			)}
		>
			<NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
			{!input.hideHandle && (
				<Handle
					id={input.name}
					isConnectable={!isConnected}
					type={'target'}
					position={Position.Left}
					className={cn(
						'!border-2 !border-background !-left-2 !w-4 !h-4 ',
						ColorForHandle[input.type]
					)}
				/>
			)}
		</div>
	)
}
