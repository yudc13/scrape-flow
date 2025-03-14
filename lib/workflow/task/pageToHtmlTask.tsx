import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';
import { CodeIcon, LucideProps } from 'lucide-react';

export const PageToHtmlTask = {
	type: TaskType.PAGE_TO_HTML,
	label: '生成页面',
	icon: (props: LucideProps) => <CodeIcon className={'stroke-rose-400'} {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: 'web page0',
			type: TaskParamType.BROWSER_INSTANCE,
			required: true,
		}
	],
	outputs: [
		{
			name: 'Html',
			type: TaskParamType.STRING,
		},
		{
			name: 'web page1',
			type: TaskParamType.BROWSER_INSTANCE,
		}
	]
} satisfies WorkflowTask