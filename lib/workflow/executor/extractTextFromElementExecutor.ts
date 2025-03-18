import { ExtractTextFromElementTask } from '@/lib/workflow/task/extractTextFromElement';
import { ExecutionEnvironment } from '@/types/executor';
import * as cheerio from 'cheerio';

export async function extractTextFromElementExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean>{
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			environment.log.error(`selector not found`);
			return false
		}
		const html = environment.getInput('Html');

		if (!html) {
			environment.log.error('html not found');
			return false
		}

		const $ = cheerio.load(html)

		const element = $(selector)

		if (!element) {
			environment.log.error('element not found');
			return false
		}

		const extractText = element.text()

		if (!extractText) {
			environment.log.error('extract text not found');
			return false
		}

		environment.setOutput('Extract Text', extractText)

		return true
	} catch (e: any) {
		environment.log.error(`extractTextFromElementExecutor: ${e.message}`)
		return false
	}
}