'use client'

import { useFlowVlidation } from '@/components/hooks/useFlowValidation'
import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import { ReactNode } from 'react'

const NodeCard = ({
	children,
	nodeId,
	isSelected,
}: {
	children: ReactNode
	nodeId: string
	isSelected: boolean
}) => {
	const { getNode, setCenter } = useReactFlow()

	const { invalidInputs } = useFlowVlidation()

	const hasInvalidInputs = invalidInputs.some((input) => input.nodeId === nodeId)

	return (
		<div
			className={cn(
				'rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col',
				isSelected && 'border-primary',
				hasInvalidInputs && 'border-destructive border-2'
			)}
			onDoubleClick={async () => {
				const node = getNode(nodeId)
				if (!node) {
					return
				}

				const { position, measured } = node
				if (!position || !measured) {
					return
				}

				const x = position.x + measured.width! / 2
				const y = position.y + measured.height! / 2

				if (x === undefined || y === undefined) {
					return
				}

				await setCenter(x, y, { zoom: 1, duration: 300 })
			}}
		>
			{children}
		</div>
	)
}

export default NodeCard
