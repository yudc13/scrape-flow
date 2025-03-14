import { ExtractTextFromElementTask } from '@/lib/workflow/task/extractTextFromElement';
import { LaunchBrowserTask } from '@/lib/workflow/task/launchBrowser';
import { PageToHtmlTask } from '@/lib/workflow/task/pageToHtmlTask';

export const TaskRegistry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask
}
