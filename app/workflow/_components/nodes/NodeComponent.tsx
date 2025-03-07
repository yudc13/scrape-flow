'use client';

import NodeCard from '@/app/workflow/_components/nodes/NodeCard';
import NodeHeader from '@/app/workflow/_components/nodes/NodeHeader';
import { NodeInput, NodeInputs } from '@/app/workflow/_components/nodes/NodeInputs';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { AppNodeData } from '@/types/appNode';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';

const NodeComponent = memo((props: NodeProps) => {
	const nodeData = props.data as AppNodeData;
	const task = TaskRegistry[nodeData.type];
	return (
		<NodeCard nodeId={props.id} isSelected={props.selected}>
			<NodeHeader taskType={nodeData.type}/>
			<NodeInputs>
				{
					task.inputs.map(input => (
						<NodeInput key={input.name} input={input} />
					))
				}
			</NodeInputs>
		</NodeCard>
	);
});

export default NodeComponent;

NodeComponent.displayName = 'NodeComponent';