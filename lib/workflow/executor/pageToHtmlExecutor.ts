import { PageToHtmlTask } from '@/lib/workflow/task/pageToHtmlTask';
import { ExecutionEnvironment } from '@/types/executor';

export async function pageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean>{
	try {
		const html = await environment.getPage()!.content();
		environment.setOutput('Html', html)
		environment.log.info('成功获取页面内容')
		return true
	} catch (e: any) {
		environment.log.error(`pageToHtmlExecutor: ${e.message}`);
		return false
	}
}