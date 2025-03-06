'use client'

import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client';
import { Background, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';

import '@xyflow/react/dist/style.css'

interface Props {
	workflow: Workflow
}


const nodeTypes = {
	Node: NodeComponent
}


const FlowEditor = ({ workflow }: Props) => {
	const [nodes, setNodes, onNodesChange] = useNodesState([
		createFlowNode(TaskType.LAUNCH_BROWSER)
	])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])
	return (
		<main className={'h-full w-full'}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
			>
				<Controls position={'top-left'} />
				<Background />
			</ReactFlow>
		</main>
	)
}

export default FlowEditor