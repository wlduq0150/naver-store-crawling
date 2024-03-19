import * as cheerio from "cheerio";
import { Page } from "puppeteer";
import {
    BRAND_CUSTOMER_NUM,
    SMART_STORE_AVERAGE_AGE,
    SMART_STORE_CEO,
    SMART_STORE_COMPANY_NAME,
    SMART_STORE_CUSTOMER_NUM,
    SMART_STORE_POPULAR_FEMALE,
    SMART_STORE_POPULAR_MALE,
} from "../constants/crawling-selector.constant";
import { SellerDetail } from "../interfaces/crawling.interface";

// 네이버 스토어 상세 데이터 크롤링
export async function crawlingSellerDetail(page: Page, storeSite: string): Promise<SellerDetail> {
    // 페이지 이동
    await page.goto(storeSite + "/profile?cp=1");
    await page.waitForSelector(SMART_STORE_AVERAGE_AGE);

    let content = await page.content();
    let root = cheerio.load(content);

    // 상세 정보 파싱
    const customerNumbers = parseCustomerFromContent(root);
    const companyName = parseCompanyNameFromContent(root);
    const ceo = parseCeoFromContent(root);
    const averageAge = parseAverageAgeFromContent(root);
    const preferedGender = parsePreferedGenderFromContent(root);

    // 기존 페이지 돌아가기
    // await page.goBack();
    // await page.waitForSelector(SMART_STORE_PAGE_LOADING);

    return {
        customerNumbers,
        companyName,
        ceo,
        averageAge,
        preferedGender,
    };
}

// 관심고객수 파싱
function parseCustomerFromContent($: cheerio.Root): number {
    const targetSmart = $(SMART_STORE_CUSTOMER_NUM);
    const targetBrand = $(BRAND_CUSTOMER_NUM);

    const textSmart = targetSmart.text();
    const textBrand = targetBrand.text();
    const text = textSmart ? textSmart : textBrand;

    const customerNumbers = +text
        .replace("관심고객수", "")
        .replace("도움말", "")
        .replaceAll(",", "");

    return customerNumbers;
}

// 상호명 파싱
function parseCompanyNameFromContent($: cheerio.Root): string {
    const target = $(SMART_STORE_COMPANY_NAME);
    const companyName = target.text();

    return companyName;
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

    let totalSum = 0;
    let totalNum = 0;

    target.children().map((idx, el) => {
        const num = +$(el).children().first().children().first().children().first().text();
        const age = +$(el).children().last().text();

        totalSum += age * num;
        totalNum += num;
    });

    const averageAge = Math.floor(totalSum / totalNum);
    return averageAge;
}

// 선호 성별 파싱
function parsePreferedGenderFromContent($: cheerio.Root): string {
    const targetMale = $(SMART_STORE_POPULAR_MALE);
    const targetFemale = $(SMART_STORE_POPULAR_FEMALE);

    const male = +targetMale.text().replace("%", "");
    const female = +targetFemale.text().replace("%", "");

    const preferedGender = male > female ? "male" : "female";
    return preferedGender;
}
