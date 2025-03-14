'use client';

import DeletableEdge from '@/app/workflow/_components/edges/DeletableEdge';
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent';
import { createFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskRegistry } from '@/lib/workflow/task/register';
import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client';
import {
	addEdge,
	Background, Connection,
	Controls,
	Edge,
	ReactFlow,
	ReactFlowJsonObject,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect } from 'react';

interface Props {
	workflow: Workflow;
}


const nodeTypes = {
	Node: NodeComponent,
};

const edgeTypes = {
	default: DeletableEdge
}


const FlowEditor = ({workflow}: Props) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const {setViewport, screenToFlowPosition, updateNodeData} = useReactFlow();

	useEffect(() => {
		try {
			const flow: ReactFlowJsonObject<AppNode, Edge> = JSON.parse(workflow.definition);

			if (!flow) {
				return;
			}

			setEdges(flow.edges || []);
			setNodes(flow.nodes || []);

			if (!flow.viewport) {
				return;
			}

			const {x = 0, y = 0, zoom = 1} = flow.viewport;
			setViewport({x, y, zoom});

		} catch (e) {
		}
	}, [setEdges, setNodes, setViewport, workflow.definition]);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);
	const onDrop = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		const taskType = event.dataTransfer.getData('application/flow');

		if (typeof taskType === 'undefined' || !taskType) {
			return;
		}

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		const newNode = createFlowNode(taskType as TaskType, position);

		setNodes((nds) => nds.concat(newNode));

	}, [screenToFlowPosition, setNodes]);

	const onConnect = useCallback((connection: Connection) => {
		console.log('@@Connect', connection);
		// 连线建立关系
		setEdges(eds => addEdge({...connection, animated: true}, eds));

		// 连线时 需要清除target的值
		if (!connection.targetHandle) {
			return
		}
		// 找到目标节点
		const node = nodes.find(node => node.id === connection.target);

		if (!node) {
			return;
		}

		const nodeInputs = node.data.inputs || {};

		delete nodeInputs[connection.targetHandle];

		updateNodeData(node.id, {
			inputs: nodeInputs,
		})

	}, [nodes, setEdges, updateNodeData]);

	const isValidConnection = useCallback((connection: Connection | Edge) => {

		// 不允许自己连接自己
		if (connection.source === connection.target) {
			return false
		}

		const source = nodes.find(node => node.id === connection.source)
		const target = nodes.find(node => node.id === connection.target)

		if (!source || !target) {
			console.error('invalid connection: source or target node not found');
			return false
		}

		// 类型不同相同,不可以连接
		const sourceTask = TaskRegistry[source.data.type]
		const targetTask = TaskRegistry[target.data.type]

		const input = targetTask.inputs.find(input => input.name === connection.targetHandle)

		const output = sourceTask.outputs.find(output => output.name === connection.sourceHandle)

		if (input?.type !== output?.type) {
			console.error('invalid connection: type mismatch');
			return false
		}

		return true
	}, [nodes]);

	return (
		<main className={'h-full w-full'}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				proOptions={{hideAttribution: true}}
				onDragOver={onDragOver}
				onDrop={onDrop}
				onConnect={onConnect}
				isValidConnection={isValidConnection}
			>
				<Controls position={'top-left'}/>
				<Background/>
			</ReactFlow>
		</main>
	);
};

export default FlowEditor;