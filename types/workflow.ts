import { AppNode } from '@/types/appNode'
import { TaskParam, TaskType } from '@/types/task'
import { LucideProps } from 'lucide-react'
import React from 'react'

export enum WorkflowStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
}

export type WorkflowTask = {
	label: string
	icon: React.FC<LucideProps>
	type: TaskType
	isEntryPoint: boolean
	inputs: TaskParam[]
	outputs: TaskParam[]
	credits: number
}

export type WorkflowExecutionPlanPhase = {
	phase: number // 步骤
	nodes: AppNode[]
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[]
