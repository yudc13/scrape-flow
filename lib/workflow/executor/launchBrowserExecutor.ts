import { LaunchBrowserTask } from '@/lib/workflow/task/launchBrowser';
import { ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';

export async function launchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean>{
	try {
		const websiteUrl = environment.getInput('Website Url');
		const browser = await puppeteer.launch({
			headless: false,
		});
		environment.setBrowser(browser);
		const page = await browser.newPage();
		environment.setPage(page)
		await page.goto(websiteUrl);
		return true
	} catch (e: any) {
		environment.log.error(`launchBrowserExecutor: ${e.message}`)
		return false
	}
}