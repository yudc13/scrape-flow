'use client'
import FlowEditor from '@/app/workflow/_components/FlowEditor';
import { Workflow } from '@prisma/client';
import { ReactFlowProvider } from '@xyflow/react';

interface Props {
	workflow: Workflow
}

const Editor = ({workflow}: Props) => {
	return (
		<ReactFlowProvider>
			<div className={'flex flex-col h-full w-full overflow-hidden'}>
				<section className={'flex h-full overflow-auto'}>
					<FlowEditor workflow={workflow} />
				</section>
			</div>
		</ReactFlowProvider>
	)
}

export default Editor