import { getWorkflowById } from '@/actions/workflows/getWorkflowById';
import Editor from '@/app/workflow/_components/Editor';
import { auth } from '@clerk/nextjs/server';

interface Props {
	params: { workflowId: string }
}
const WorkflowPage = async ({params}: Props) => {
	const { workflowId } = params
	const {userId} = await auth()
	if (!userId) {
		return <div>Not authenticated</div>
	}
	const workflow = await getWorkflowById(workflowId)

	if (!workflow) {
		return <div>Not found</div>
	}

	return (
		<div className={'w-full h-full'}>
			<Editor workflow={workflow} />
		</div>
	)
}

export default WorkflowPage