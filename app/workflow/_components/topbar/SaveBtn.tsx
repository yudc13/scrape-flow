'use client';

import { updateWorkflow } from '@/actions/workflows/updateWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';

const SaveBtn = ({workflowId}: { workflowId: string }) => {
	const {toObject} = useReactFlow();

	const updateMutation = useMutation({
		mutationFn: updateWorkflow,
		onSuccess: () => {
			toast.success('保存成功', {id: workflowId});
		},
		onError: () => {
			toast.error('保存失败', {id: workflowId});
		},
	});

	const onSave = () => {
		toast.loading('保存中...', {id: workflowId});
		updateMutation.mutate({
			workflowId,
			workflowDefinition: JSON.stringify(toObject()),
		});
	};
	return (
		<Button variant={'outline'} className={'flex items-center gap-2'} disabled={updateMutation.isPending}
		        onClick={onSave}>
			<CheckIcon className={'stroke-green-400'}/>
			保存
		</Button>
	);
};

export default SaveBtn;