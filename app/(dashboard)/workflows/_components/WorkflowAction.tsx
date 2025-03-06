import DeleteWorkflowDialog from '@/app/(dashboard)/workflows/_components/DeleteWorkflowDialog';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Workflow } from '@prisma/client';

const WorkflowAction = ({workflow}: { workflow: Workflow }) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	return (
		<>
			<DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflow.name} workflowId={workflow.id} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={'outline'} size={'sm'}>
						<TooltipWrapper content={'更多'}>
							<div className={'flex items-center justify-center w-full h-full'}>
								<MoreVerticalIcon size={18} />
							</div>
						</TooltipWrapper>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align={'end'}>
					<DropdownMenuLabel>操作</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className={'text-destructive flex items-center gap-2'} onClick={() => setShowDeleteDialog(true)}>
						<TrashIcon size={16} />
						删除
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}

export default WorkflowAction