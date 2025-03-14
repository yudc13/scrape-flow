'use client'

import StringParam from '@/app/workflow/_components/nodes/param/StringParam';
import { AppNode } from '@/types/appNode';
import { TaskParam, TaskParamType } from '@/types/task';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const NodeParamField = ({param, nodeId, disabled}: { param: TaskParam, nodeId: string, disabled?: boolean }) => {

	const {updateNodeData, getNode} = useReactFlow()
	const node = getNode(nodeId) as AppNode
	const value = node?.data?.inputs?.[param.name] || ''

	const updateNodeParamValue = useCallback((newValue: string) => {
		updateNodeData(nodeId, {
			inputs: {
				...node?.data?.inputs,
				[param.name]: newValue,
			},
		})
	}, [node?.data?.inputs, nodeId, param.name, updateNodeData])

	switch (param.type) {
		case TaskParamType.STRING:
			return <StringParam param={param} disabled={disabled} value={value}  onUpdateNodeParamValue={updateNodeParamValue}/>
		default:
			return (
				<div className={'w-full'}>
					<p className={'text-xs text-muted-foreground'}>暂无实现该功能</p>
				</div>
			)
	}
}

export default NodeParamField