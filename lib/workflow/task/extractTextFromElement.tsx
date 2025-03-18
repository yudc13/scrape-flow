import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';
import { LucideProps, TextIcon } from 'lucide-react';

export const ExtractTextFromElementTask = {
	type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
	label: '抓取文本',
	icon: (props: LucideProps) => <TextIcon className={'stroke-rose-400'} {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: 'Html',
			type: TaskParamType.STRING,
			required: true,
			variant: 'textarea'
		},
		{
			name: 'Selector',
			type: TaskParamType.STRING,
			required: true,
		}
	] as const,
	outputs: [
		{
			name: 'Extract Text',
			type: TaskParamType.STRING,
		},
	] as const
} satisfies WorkflowTask