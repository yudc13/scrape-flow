import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	workflowName: string;
	workflowId: string;
}

const DeleteWorkflowDialog = ({open, setOpen, workflowName, workflowId}: Props) => {
	const [confirmText, setConfirmText] = useState('');

	const deleteMutate = useMutation({
		mutationFn: deleteWorkflow,
		onSuccess: () => {
			toast.success('删除成功', {id: workflowId});
			setConfirmText('')
		},
		onError: () => {
			toast.error('删除失败', {id: workflowId});
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={(open) => {
			setConfirmText('');
			setOpen(open);
		}}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>确定要删除此工作流?</AlertDialogTitle>
					<AlertDialogDescription>
						如果你删除次工作流, 你将不会再恢复它
						<div className={'flex flex-col py-4 gap-2'}>
							<div>如果你确定删除, 请输入 <b>{workflowName}</b></div>
							<Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)}/>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>取消</AlertDialogCancel>
					<AlertDialogAction
						disabled={confirmText !== workflowName}
						className={'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
						onClick={e => {
							e.stopPropagation();
							toast.loading('删除中', {
								id: workflowId,
							});
							deleteMutate.mutate(workflowId)
						}}
					>
						删除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteWorkflowDialog;