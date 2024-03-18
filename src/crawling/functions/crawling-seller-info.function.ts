import { Page } from "puppeteer";
import * as cheerio from "cheerio";
import {
    SMART_STORE_ADDRESS,
    SMART_STORE_BUISNESS_NUMBER,
    SMART_STORE_CATEGORY,
    SMART_STORE_CLOSE_BTN,
    SMART_STORE_INFO_BTN,
    SMART_STORE_PAGE_LOADING,
    SMART_STORE_SHOP_NAME,
    SMART_STORE_SITE,
    SMART_STORE_SITE_AD,
} from "../constants/crawling-selector.constant";
import { waitForSeconds } from "./crawling-wait.function";
import { SellerInfo } from "../interfaces/crawling.interface";

// 네이버 스토어 판매자 정보 크롤링
export async function crawlingSellerInfo(page: Page, productIndex: number): Promise<SellerInfo> {
    // 상품 순서를 통해 selector 가져오기
    const SMART_STORE_TARGET = getSelectorForIndex(productIndex);
    const SMART_STORE_SELLER_BTN = SMART_STORE_TARGET + " > " + SMART_STORE_INFO_BTN;

    // 쇼핑몰 정보가 없을 경우 예외처리
    try {
        await page.waitForSelector(SMART_STORE_SELLER_BTN, { timeout: 3000 });
    } catch (e) {
        return null;
    }

    // 판매자 정보 버튼 클릭
    await page.click(SMART_STORE_SELLER_BTN);
    await waitForSeconds(1);

    let content = await page.content();
    let root = cheerio.load(content);

    // 판매자 정보 창 닫기
    await page.waitForSelector(SMART_STORE_CLOSE_BTN);
    await page.click(SMART_STORE_CLOSE_BTN);
    await waitForSeconds(0.5);

    // 판매자 정보 크롤링
    const category = parseCategoryFromContent(root, SMART_STORE_TARGET);
    const store_site_default = parseStoreSiteFromContent(root, SMART_STORE_TARGET);
    const store_site_ad = parseStoreSiteADFromContent(root, SMART_STORE_SITE_AD);
    const store_site = await parseStoreSiteFromLink(page, store_site_default, store_site_ad);
    const shop_name = parseShopNameFromContent(root);
    const address = parseAddressFromContent(root);
    const buisness_number = parseBusinessNumberFromContent(root);

    return {
        shop_name,
        category,
        address,
        buisness_number,
        store_site,
    };
}

// 상품 순서를 selector로 변환
function getSelectorForIndex(productIndex: number): string {
    return `#content > div.style_content__xWg5l > div.basicList_list_basis__uNBZx > div > div:nth-child(${productIndex})`;
}

// 쇼핑몰 이름 파싱
function parseShopNameFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_SHOP_NAME);
    const shop_name = target.text();

    return shop_name;
}

// 회사 주소 파싱
function parseAddressFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_ADDRESS);
    const address = target.text();

    return address;
}

// 회사 사업자등록번호 파싱
function parseBusinessNumberFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_BUISNESS_NUMBER);
    const buisness_number = target.text();

    return buisness_number;
}

// 쇼핑몰 분류 파싱
function parseCategoryFromContent($: cheerio.Root, targetSelector: string): string {
    const target = $(targetSelector + " > " + SMART_STORE_CATEGORY);
    const category = target.text();

    return category;
}

// 쇼핑몰 링크 default 파싱
function parseStoreSiteFromContent($: cheerio.Root, targetSelector: string): string {
    const target = $(targetSelector + " > " + SMART_STORE_SITE);
    const store_site_default = target.attr("href");

    return store_site_default;
}

// 쇼핑몰 링크 AD 파싱
function parseStoreSiteADFromContent($: cheerio.Root, targetSelector: string): string {
    const target = $(targetSelector + " > " + SMART_STORE_SITE);
    const store_site_ad = target.attr("href");

    return store_site_ad;
}

// 쇼핑몰 링크 파싱
async function parseStoreSiteFromLink(
    page: Page,
    site_default: string,
    site_ad: string,
): Promise<string> {
    const site = site_default ? site_default : site_ad;

    await page.goto(site, { timeout: 10000 });
    const store_site = page.url().split("?").shift();
    await page.goBack();
    await page.waitForSelector(SMART_STORE_PAGE_LOADING);

    return store_site;
}
