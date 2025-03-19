'use client';

import { getWorkflowExecutionWithPhase } from '@/actions/workflows/getWorkflowExecutionWithPhase';
import { getWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails';
import PhaseStatusBadge from '@/app/workflow/runs/[workflowId]/[executionId]/_components/PhaseStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { datesToDurationString } from '@/lib/helper/dates';
import { ExecutionPhaseStatus, WorkFlowExecutionStatus } from '@/types/workflow';
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

	const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

	const query = useQuery({
		queryKey: ['workflow-execution', execution?.id],
		initialData: execution,
		queryFn: () => getWorkflowExecutionWithPhase(execution!.id),
		refetchInterval: q => q.state.data?.status === WorkFlowExecutionStatus.RUNNING ? 1000 : false,
	});

	const phaseQuery = useQuery({
		queryKey: ['phaseDetails', selectedPhase],
		enabled: selectedPhase !== null,
		queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
	});

	const duration = datesToDurationString(query?.data?.completeAt, query?.data?.startAt);

	const isRunning = query?.data?.status === WorkFlowExecutionStatus.RUNNING;

	return (
		<div className={'flex w-full h-full'}>
			<aside className={'w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden'}>
				<div className={'py-4 px-8 flex flex-col gap-4'}>
					<ExecutionLabel icon={CircleDashedIcon} label={'状态'} value={query?.data?.status}/>
					<ExecutionLabel
						icon={CalendarIcon}
						label={'执行时间'}
						value={query?.data?.startAt ? formatDistanceToNow(query?.data?.startAt, {addSuffix: true}) : '-'}
					/>
					<ExecutionLabel
						icon={ClockIcon}
						label={'运行时间'}
						value={duration ? duration : <Loader2Icon className={'animate-spin'} size={20}/>}
					/>
					<ExecutionLabel
						icon={CoinsIcon}
						label={'信用'}
						value={'TODO'}
					/>
				</div>
				<Separator/>
				<div className={'flex items-center justify-center py-4'}>
					<div className={'flex items-center gap-2 text-muted-foreground'}>
						<WorkflowIcon size={20} className={'stroke-muted-foreground/80'}/>
						<span className="font-semibold">执行步骤</span>
					</div>
				</div>
				<Separator/>
				<div className={'h-full overflow-auto p-4 flex flex-col gap-2'}>
					{
						query?.data?.phase.map((phase, index) => (
							<Button
								key={phase.id}
								variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
								className={'w-full flex justify-between'}
								onClick={() => {
									if (isRunning) {
										return;
									}
									setSelectedPhase(phase.id);
								}}
							>
								<div className={'flex items-center gap-2'}>
									<Badge variant={'outline'}>{index + 1}</Badge>
									<p className={'font-semibold'}>{phase.name}</p>
								</div>
								<PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
							</Button>
						))
					}
				</div>
			</aside>
			<div className={'flex w-full h-full'}>
				{
					isRunning && (
						<div className={'flex items-center justify-center w-full h-full'}>
							<p className={'font-bold'}>正在运行中...</p>
						</div>
					)
				}
				{
					!isRunning && !selectedPhase && (
						<div className={'flex items-center justify-center w-full h-full'}>
							<p className={'font-bold'}>请选择一个步骤</p>
						</div>
					)
				}
				{
					!isRunning && selectedPhase && phaseQuery?.data && (
						<div className={'flex flex-col py-4 gap-4 overflow-auto container'}>
							<div className={'flex gap-2 items-center'}>
								<Badge variant={'outline'} className={'space-x-4'}>
									<div className={'flex items-center gap-1'}>
										<CoinsIcon size={18} className={'stroke-muted-foreground'}/>
										<span>信用</span>
									</div>
									<span>TODO</span>
								</Badge>
								<Badge variant={'outline'} className={'space-x-4'}>
									<div className={'flex items-center gap-1'}>
										<ClockIcon size={18} className={'stroke-muted-foreground'}/>
										<span>运行时长</span>
									</div>
									<span>
										{datesToDurationString(phaseQuery?.data?.completeAt, phaseQuery?.data?.startAt) || '-'}
									</span>
								</Badge>
							</div>
							<ParameterViewer title={'输入'} subTitle={'该阶段使用的输入参数'} paramsJson={phaseQuery?.data?.inputs}/>
							<ParameterViewer title={'输出'} subTitle={'该阶段输出的参数'} paramsJson={phaseQuery?.data?.outputs}/>
						</div>
					)
				}
			</div>
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

function ParameterViewer({title, subTitle, paramsJson}: {
	title: string,
	subTitle: string,
	paramsJson: string | null
}) {
	const params = paramsJson ? JSON.parse(paramsJson) : undefined;

	return (
		<Card>
			<CardHeader className={'rounded-lg rounded-b-none border-b py-4 bg-gray-100 dark:bg-background'}>
				<CardTitle className={'text-base'}>{title}</CardTitle>
				<CardDescription className={'text-muted-foreground text-sm'}>{subTitle}</CardDescription>
			</CardHeader>
			<CardContent className={'py-4'}>
				<div className={'flex flex-col gap-2'}>
					{
						!params || Object.keys(params).length === 0 && (
							<p className={'font-bold text-sm'}>暂无参数数据</p>
						)
					}
					{
						params && Object.entries(params).map(([key, value]) => (
							<div key={key} className={'flex justify-between items-center'}>
								<p className={'text-sm text-muted-foreground flex-1 flex basis-1/3'}>{key}</p>
								<Input readOnly value={value as string} className={'flex-1 basis-2/3'}/>
							</div>
						))
					}
				</div>
			</CardContent>
		</Card>
	);
}