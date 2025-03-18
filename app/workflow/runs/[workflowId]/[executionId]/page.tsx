import { getWorkflowExecutionWithPhase } from '@/actions/workflows/getWorkflowExecutionWithPhase';
import Topbar from '@/app/workflow/_components/topbar/Topbar';
import { ExecutionViewer } from '@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';

interface Props {
	params: {
		workflowId: string
		executionId: string
	}
}

export default function ExecutionPage({ params }: Props) {
	return (
		<div className={'w-full h-screen flex flex-col overflow-hidden'}>
			<Topbar workflowId={params.workflowId} title={'详情'} subTitle={`Run ID: ${params.executionId}`} hiddenButs={true} />
			<section className={'flex flex-col overflow-auto h-full'}>
				<Suspense fallback={
					<div className={'flex w-full h-full justify-center items-center'}>
						<Loader2Icon className={'w-10 h-10 animate-spin'} />
					</div>
				}>
					<ExecutionViewWrapper executionId={params.executionId} />
				</Suspense>
			</section>
		</div>
	)
}

async function ExecutionViewWrapper({executionId}: {  executionId: string }) {
	const executionWithPhase = await getWorkflowExecutionWithPhase(executionId)
	return (
		<div className={'h-full'}>
			<ExecutionViewer execution={executionWithPhase} />
		</div>
	)
}