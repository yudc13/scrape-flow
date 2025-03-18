'use client';

import { getWorkflowExecutionWithPhase } from '@/actions/workflows/getWorkflowExecutionWithPhase';
import { getWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { datesToDurationString } from '@/lib/helper/dates';
import { WorkFlowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
	CalendarIcon,
	CircleDashedIcon,
	ClockIcon,
	CoinsIcon,
	Loader2Icon,
	LucideIcon,
	WorkflowIcon,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhase>>

export function ExecutionViewer({execution}: { execution: ExecutionData }) {

	const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

	const query = useQuery({
		queryKey: ['workflow-execution', execution?.id],
		initialData: execution,
		queryFn: () => getWorkflowExecutionWithPhase(execution!.id),
		// refetchInterval: q => q.state.data?.status === WorkFlowExecutionStatus.RUNNING ? 1000 : false,
	});

	const phaseQuery = useQuery({
		queryKey: ['phaseDetails', selectedPhase],
		enabled: selectedPhase !== null,
		queryFn: () => getWorkflowPhaseDetails(selectedPhase!)
	})

	const duration = datesToDurationString(query?.data?.completeAt, query?.data?.startAt)

	const isRunning = query?.data?.status === WorkFlowExecutionStatus.RUNNING;

	return (
		<div className={'flex flex-col w-full h-full'}>
			<aside className={'w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden'}>
				<div className={'p-4 flex flex-col gap-4'}>
					<ExecutionLabel icon={CircleDashedIcon} label={'状态'} value={query?.data?.status}/>
					<ExecutionLabel
						icon={CalendarIcon}
						label={'开始时间'}
						value={query?.data?.startAt ? formatDistanceToNow(query?.data?.startAt, {addSuffix: true}) : '-'}
					/>
					<ExecutionLabel
						icon={ClockIcon}
						label={'运行时间'}
						value={duration ? duration : <Loader2Icon className={'animate-spin'} size={20} />}
					/>
					<ExecutionLabel
						icon={CoinsIcon}
						label={'消耗'}
						value={'TODO'}
					/>
				</div>
				<Separator />
				<div className={'flex items-center justify-center py-4'}>
					<div className={'flex items-center gap-2 text-muted-foreground'}>
						<WorkflowIcon size={20} className={'stroke-muted-foreground/80'} />
						<span className="font-semibold">执行步骤</span>
					</div>
				</div>
				<Separator />
				<div className={'h-full overflow-auto p-4 flex flex-col gap-2'}>
					{
						query?.data?.phase.map((phase, index) => (
							<Button
								key={phase.id}
								variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
								className={'w-full flex justify-between'}
								onClick={() => {
									if (isRunning) {
										return
									}
									setSelectedPhase(phase.id)
								}}
							>
								<div className={'flex items-center gap-2'}>
									<Badge variant={'outline'}>{index + 1}</Badge>
									<p className={'font-semibold'}>{phase.name}</p>
								</div>
								<span className={'text-muted-foreground'}>{phase.status}</span>
							</Button>
						))
					}
				</div>
			</aside>
		</div>
	);
}

function ExecutionLabel({icon, label, value}: { icon: LucideIcon, label: ReactNode, value: ReactNode }) {
	const Icon = icon;
	return (
		<div className={'flex justify-between items-center gap-2 text-xs'}>
			<div className={'text-muted-foreground flex items-center gap-2'}>
				<Icon size={20} className={'stroke-muted-foreground/80'}/>
				<span>{label}</span>
			</div>
			<div className={'font-semibold capitalize flex gap-2 items-center'}>
				{value}
			</div>
		</div>
	);
}