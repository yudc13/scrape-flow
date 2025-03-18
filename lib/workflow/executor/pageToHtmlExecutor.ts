import { PageToHtmlTask } from '@/lib/workflow/task/pageToHtmlTask';
import { ExecutionEnvironment } from '@/types/executor';

export async function pageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean>{
	try {
		const html = await environment.getPage()!.content();
		environment.setOutput('Html', html)
		return true
	} catch (e) {
		console.log('pageToHtmlExecutor: ', e);
		return false
	}
}