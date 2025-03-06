import { TaskType } from '@/types/task';
import {Node} from '@xyflow/react'

export interface AppNodeData {
	type: TaskType,
	inputs: Record<string, string>
  [key: string]: any
}

export interface AppNode extends Node {
	data: AppNodeData
}