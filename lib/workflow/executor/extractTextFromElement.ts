import { ExtractTextFromElementTask } from '@/lib/workflow/task/extractTextFromElement';
import { ExecutionEnvironment } from '@/types/executor';
import * as cheerio from 'cheerio';

export async function extractTextFromElement(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean>{
	try {
		const selector = environment.getInput('Selector');
		if (!selector) {
			console.error('selector not found');
			return false
		}
		const html = environment.getInput('Html');

		if (!html) {
			console.error('html not found');
			return false
		}

		const $ = cheerio.load(html)

		const element = $(selector)

		if (!element) {
			console.error('element not found');
			return false
		}

		const extractText = element.text()

		if (!extractText) {
			console.error('extract text not found');
			return false
		}

		environment.setOutput('Extract Text', extractText)

		return true
	} catch (e) {
		return false
	}
}