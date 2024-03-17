import { Page } from "puppeteer";

export async function infiniteScroll(page: Page) {
    while (true) {
        try {
            // 스크롤
            const scrollHeight = "document.body.scrollHeight";
            const previousHeight = await page.evaluate(scrollHeight);
            await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
            await page.waitForFunction(`${scrollHeight} > ${previousHeight}`, {
                timeout: 1000,
            });
        } catch (e) {
            break;
        }
    }
}
