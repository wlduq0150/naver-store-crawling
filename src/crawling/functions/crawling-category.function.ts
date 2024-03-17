import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import { NAVER_STORE_HOME_URL } from "../constants/crawling-url.constant";
import {
    NAVER_STORE_CATEGORY_BTN,
    NAVER_STORE_CATEGORY_MODAL,
    NAVER_STORE_CATEGORY_UL,
} from "../constants/crawling-selector.constant";

// 네이버 스토어 카테고리 크롤링 함수
export async function crawlingCategory(page: Page, storeSite: string): Promise<string[][]> {
    const categorys: string[][] = [];

    // 페이지 이동
    await page.goto(NAVER_STORE_HOME_URL);
    await page.waitForSelector(NAVER_STORE_CATEGORY_BTN);

    // 카테고리 버튼 클릭
    await page.click(NAVER_STORE_CATEGORY_BTN);
    await page.waitForSelector(NAVER_STORE_CATEGORY_MODAL, {
        timeout: 3000,
    });

    let content = await page.content();
    let $ = cheerio.load(content);
    let element: cheerio.Cheerio;

    element = $(NAVER_STORE_CATEGORY_UL);
    element.children().map((idx, el) => {
        const data = parseDataFromElement($, el);
        categorys.push(data);
    });

    return categorys;
}

// 카테고리 li에서 id, 단어 파싱함수
function parseDataFromElement($: cheerio.Root, element: cheerio.Element): string[] {
    const target = $(element).children("a");
    const id = target.attr("href").split("=").pop();
    const category = target.text();
    return [id, category];
}
