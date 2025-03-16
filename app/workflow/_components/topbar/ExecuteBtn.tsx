'use client'

import { useExecutionPlan } from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'
import {useMutation} from "@tanstack/react-query";
import {runWorkflow} from "@/actions/workflows/runWorkflow";
import {toast} from "sonner";
import {useReactFlow} from "@xyflow/react";

export default function ExecuteBtn({workflowId}: { workflowId: string }) {
	const {toObject} = useReactFlow();
	const generate = useExecutionPlan()
	const mutation = useMutation({
		mutationFn: runWorkflow,
		onSuccess: () => {
			toast.success('开始执行', { id: 'flow-execution' })
		},
		onError: () => {
			toast.error('开始失败', { id: 'flow-execution' })
		}
	})
	return (
		<Button
			variant={'outline'}
			disabled={mutation.isPending}
			className={'flex items-center gap-2'}
			onClick={() => {
				const plan = generate()
				console.table(plan)
				if (!plan) {
					return
				}
				mutation.mutate({
					workflowId,
					workflowDefinition: JSON.stringify(toObject()),
				})
			}}
		>
			<PlayIcon size={16} className={'stroke-orange-400'} />
			执行
		</Button>
	)
}
