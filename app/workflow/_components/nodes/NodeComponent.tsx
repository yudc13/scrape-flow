'use client'

import NodeCard from '@/app/workflow/_components/nodes/NodeCard';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';

const NodeComponent = memo((props: NodeProps) => {
	return <NodeCard nodeId={props.id} isSelected={props.selected}>appNode</NodeCard>
})

export default NodeComponent

NodeComponent.displayName = 'NodeComponent'