import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import {
    BRAND_CUSTOMER_NUM,
    SMART_STORE_AVERAGE_AGE,
    SMART_STORE_CEO,
    SMART_STORE_COMPANY_NAME,
    SMART_STORE_CUSTOMER_NUM,
    SMART_STORE_PAGE_LOADING,
    SMART_STORE_POPULAR_FEMALE,
    SMART_STORE_POPULAR_MALE,
} from "../constants/crawling-selector.constant";
import { SellerDetail } from "../interfaces/crawling.interface";

// 네이버 스토어 상세 데이터 크롤링
export async function crawlingSellerDetail(page: Page, storeSite: string): Promise<SellerDetail> {
    // 페이지 이동
    await page.goto(storeSite + "/profile?cp=1");
    console.log(storeSite + "/profile?cp=1");
    await page.waitForSelector(SMART_STORE_AVERAGE_AGE);

    let content = await page.content();
    let root = cheerio.load(content);

    // 상세 정보 파싱
    const customer_numbers = parseCustomerFromContent(root);
    const company_name = parseCompanyNameFromContent(root);
    const ceo = parseCeoFromContent(root);
    const average_age = parseAverageAgeFromContent(root);
    const prefered_gender = parsePreferedGenderFromContent(root);

    // 기존 페이지 돌아가기
    // await page.goBack();
    // await page.waitForSelector(SMART_STORE_PAGE_LOADING);

    return {
        customer_numbers,
        company_name,
        ceo,
        average_age,
        prefered_gender,
    };
}

// 관심고객수 파싱
function parseCustomerFromContent($: cheerio.Root): number {
    const target_smart = $(SMART_STORE_CUSTOMER_NUM);
    const target_brand = $(BRAND_CUSTOMER_NUM);

    const text_smart = target_smart.text();
    const text_brand = target_brand.text();
    const text = text_smart ? text_smart : text_brand;

    const customer_numbers = +text
        .replace("관심고객수", "")
        .replace("도움말", "")
        .replaceAll(",", "");

    return customer_numbers;
}

// 상호명 파싱
function parseCompanyNameFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_COMPANY_NAME);
    const company_name = target.text();

    return company_name;
}

// 대표명 파싱
function parseCeoFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_CEO);
    const ceo = target.text();

    return ceo;
}

// 평균연령대 파싱
function parseAverageAgeFromContent($: cheerio.Root): number {
    const target = $(SMART_STORE_AVERAGE_AGE);

    let total_sum = 0;
    let total_num = 0;

    target.children().map((idx, el) => {
        const num = +$(el).children().first().children().first().children().first().text();
        const age = +$(el).children().last().text();

        total_sum += age * num;
        total_num += num;
    });

    const average_age = Math.floor(total_sum / total_num);
    return average_age;
}

// 선호 성별 파싱
function parsePreferedGenderFromContent($: cheerio.Root): string {
    const target_male = $(SMART_STORE_POPULAR_MALE);
    const target_female = $(SMART_STORE_POPULAR_FEMALE);

    const male = +target_male.text().replace("%", "");
    const female = +target_female.text().replace("%", "");

    const prefered_gender = male > female ? "male" : "female";
    return prefered_gender;
}
