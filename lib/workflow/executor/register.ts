import { extractTextFromElement } from '@/lib/workflow/executor/extractTextFromElement';
import { launchBrowserExecutor } from '@/lib/workflow/executor/launchBrowserExecutor';
import { pageToHtmlExecutor } from '@/lib/workflow/executor/pageToHtmlExecutor';
import { ExecutionEnvironment } from '@/types/executor';
import { TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/workflow';

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type Register = {
	[k in TaskType]: ExecutorFn<WorkflowTask & { type: k }>
}

export const ExecutorRegister: Register = {
	LAUNCH_BROWSER: launchBrowserExecutor,
	PAGE_TO_HTML: pageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElement,
}