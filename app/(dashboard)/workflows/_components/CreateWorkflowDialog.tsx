'use client';

import { createWorkflow } from '@/actions/workflows/createWorkflow';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createWorkflowSchema, CreateWorkflowSchemaType } from '@/schema/workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Layers2Icon, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CreateWorkflowDialog = ({triggerText}: { triggerText?: string }) => {

	const form = useForm<CreateWorkflowSchemaType>({
		resolver: zodResolver(createWorkflowSchema),
		defaultValues: {},
	});

	const {mutate, isPending} = useMutation({
		mutationFn: createWorkflow,
		onSuccess: () => {
			toast.success('创建成功', { id: 'create-workflow' });
		},
		onError: () => {
			toast.error('创建失败', { id: 'create-workflow' });
		},
	});

	const onSubmit = useCallback((data: CreateWorkflowSchemaType) => {
		mutate(data);
	}, [mutate]);

	return (
		<Dialog onOpenChange={(open) => {
			if (!open) {
				form.reset()
			}
		}}>
			<DialogTrigger asChild>
				<Button>{triggerText ?? '创建工作流'}</Button>
			</DialogTrigger>
			<DialogContent className={'px-0'}>
				<CustomDialogHeader
					icon={Layers2Icon}
					title={'创建工作流'}
					subTitle={'开始构建你的工作流'}
				/>
				<div className={'p-6'}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8 w-full'}>
							<FormField name={'name'} control={form.control} render={({field}) => (
								<FormItem>
									<FormLabel className={'flex gap-1 items-center'}>
										名称
										<p className={'text-xs text-primary'}>(必填)</p>
									</FormLabel>
									<Input {...field} />
								</FormItem>
							)}/>
							<FormField name={'description'} control={form.control} render={({field}) => (
								<FormItem>
									<FormLabel className={'flex gap-1 items-center'}>
										描述
										<p className={'text-xs text-muted-foreground'}>(可选)</p>
									</FormLabel>
									<Textarea {...field} className={'resize-none'}/>
								</FormItem>
							)}/>
							<Button type={'submit'} className={'w-full'}>
								{
									isPending ? <Loader2 className={'animate-spin'} /> : '创建'
								}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateWorkflowDialog;