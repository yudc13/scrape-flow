'use client'
import FlowEditor from '@/app/workflow/_components/FlowEditor';
import TaskMenu from '@/app/workflow/_components/TaskMenu';
import TopBar from '@/app/workflow/_components/topbar/Topbar';
import { Workflow } from '@prisma/client';
import { ReactFlowProvider } from '@xyflow/react';

interface Props {
	workflow: Workflow
}

const Editor = ({workflow}: Props) => {
	return (
		<ReactFlowProvider>
			<div className={'flex flex-col h-full w-full overflow-hidden'}>
				<TopBar title={'编辑流水线'} subTitle={workflow.name} workflowId={workflow.id} />
				<section className={'flex h-full overflow-auto'}>
					<TaskMenu />
					<FlowEditor workflow={workflow} />
				</section>
			</div>
		</ReactFlowProvider>
	)
}

export default Editor