import { ExtractTextFromElementTask } from '@/lib/workflow/task/extractTextFromElement';
import { LaunchBrowserTask } from '@/lib/workflow/task/launchBrowser';
import { PageToHtmlTask } from '@/lib/workflow/task/pageToHtmlTask';
import { TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';

type Register = {
	[k in TaskType]: WorkflowTask & { type: k }
}

export const TaskRegistry: Register = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask
}
