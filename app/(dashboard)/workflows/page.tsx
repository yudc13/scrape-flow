import { GetWorkflowsForUser } from '@/actions/workflows/getWorkflowsForUser';
import CreateWorkflowDialog from '@/app/(dashboard)/workflows/_components/CreateWorkflowDialog';
import WorkflowCard from '@/app/(dashboard)/workflows/_components/WorkflowCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, InboxIcon } from 'lucide-react';
import { Suspense } from 'react';

const WorkflowPage = () => {
	return (
		<div className={'flex flex-col flex-1 h-full'}>
			<div className={'flex justify-between'}>
				<div className={'flex flex-col'}>
					<h1 className={'text-3xl font-bold'}>工作流</h1>
					<p className={'text-muted-foreground'}>管理你的工作流</p>
				</div>
				<CreateWorkflowDialog/>
			</div>

			<div className={'h-full py-6'}>
				<Suspense fallback={<UserWorkflowsSkeleton/>}>
					<UserWorkflows/>
				</Suspense>
			</div>
		</div>
	);
};

function UserWorkflowsSkeleton() {
	return (
		<div className={'space-y-2'}>
			{
				[1, 2, 3, 4].map(i => <Skeleton key={i} className={'h-32 w-full'}/>)
			}
		</div>
	);
}

async function UserWorkflows() {
	const workflows = await GetWorkflowsForUser();
	if (!workflows) {
		return (
			<Alert variant={'destructive'}>
				<AlertCircle className={'w-4 h-4'}/>
				<AlertTitle>提示</AlertTitle>
				<AlertDescription>服务异常, 请稍后再试!</AlertDescription>
			</Alert>
		);
	}

	if (workflows.length === 0) {
		return (
			<div className={'flex flex-col gap-4 h-full items-center justify-center'}>
				<div className={'rounded-full bg-accent w-20 h-20 flex items-center justify-center'}>
					<InboxIcon size={40} className={'stroke-primary'}/>
				</div>
				<div className={'flex flex-col gap-1 text-center'}>
					<p className={'font-bold'}>还没有工作流</p>
					<p className={'text-sm text-muted-foreground'}>点击下面的按钮来创建你的第一个工作流</p>
					<CreateWorkflowDialog triggerText={'创建你的第一个工作流'}/>
				</div>
			</div>
		);
	}

	return (
		<div className={'grid grid-cols-1 gap-4'}>
			{
				workflows.map(workflow => (
					<WorkflowCard key={workflow.id} workflow={workflow}/>
				))
			}
		</div>
	);
}

export default WorkflowPage;