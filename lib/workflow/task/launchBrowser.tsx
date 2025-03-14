import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask = {
	type: TaskType.LAUNCH_BROWSER,
	label: '启动浏览器',
	icon: (props: LucideProps) => <GlobeIcon className={'stroke-pink-400'} {...props} />,
	isEntryPoint: true,
	credits: 1,
	inputs: [
		{
			name: '网站URL',
			type: TaskParamType.STRING,
			helperText: '例如: https://example.com',
			required: true,
			hideHandle: true
		}
	],
	outputs: [
		{
			name: 'Web page2',
			type: TaskParamType.BROWSER_INSTANCE,
		}
	]
} satisfies WorkflowTask