import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import { CRAWLING_HEIGHT, CRAWLING_WIDTH } from "./constants/crawling-option.constant";
import { crawlingSellerDetail } from "./functions/crawling-seller-detail.function";
import { crawlingSellerInfo } from "./functions/crawling-seller-info.function";
import { ConfigService } from "@nestjs/config";
import { naverPageLogin } from "./functions/crawling-naver-login.function";
import { infiniteScroll } from "./functions/crawling-infinite-scroll.function";
import { SMART_STORE_PAGE_LOADING } from "./constants/crawling-selector.constant";
import { ISeller, SellerInfo } from "./interfaces/crawling.interface";
import { CrawlingStoreOption } from "./dto/crawling-store-option.dto";
import { Page } from "puppeteer";
import { SellerService } from "src/seller/seller.service";

@Injectable()
export class CrawlingService {
    constructor(
        private readonly configService: ConfigService,
        private readonly sellerService: SellerService,
    ) {}

    async crawlingSmartStore(crawlingStoreOption: CrawlingStoreOption): Promise<ISeller[]> {
        let { catId, pageIndex, productIndex, num } = crawlingStoreOption;

        const browser = await puppeteer.launch({
            headless: process.env.NODE_ENV === "development" ? false : true,
            // args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // 크롤링을 페이지 기본 옵션 설정
        await page.setViewport({
            width: CRAWLING_WIDTH,
            height: CRAWLING_HEIGHT,
        });
        await page.setDefaultTimeout(3000);

        // 네이버 로그인(판매자 정보 크롤링을 위해 필요)
        const id = this.configService.get("NAVER_ID");
        const pw = this.configService.get("NAVER_PW");
        await naverPageLogin(page, id, pw);

        // 개수만큼 판매자 데이터 크롤링
        const sellers = await this.crawlSellerForNum(page, catId, pageIndex, productIndex, num);

        // 크롤링 데이터 저장
        this.saveSellerData(sellers);

        page.close();
        browser.close();

        return sellers;
    }

    // 판매자 데이터 크롤링
    async crawlSellerForNum(
        page: Page,
        catId: string,
        pageIndex: number,
        productIndex: number,
        num: number,
    ): Promise<ISeller[]> {
        const sellers: ISeller[] = [];

        let cnt = 0;
        while (cnt < num) {
            try {
                // 페이지 이동
                const pageUrl = this.getUrlForOption(catId, pageIndex);
                await page.goto(pageUrl);
                await page.waitForSelector(SMART_STORE_PAGE_LOADING);

                // 무한 스크롤링 방지
                await infiniteScroll(page);

                // 판매자 정보 크롤링
                const sellerInfo = await crawlingSellerInfo(page, productIndex);
                productIndex++;

                // null일 경우 건너뛰기
                if (!sellerInfo) continue;

                // 스마트스토어가 아닌 경우 건너뛰기
                const isSmartStore = this.checkIsSmartStore(sellerInfo.store_site);
                if (!isSmartStore) continue;

                // 판매자 상세정보 크롤링
                const sellerDetail = await crawlingSellerDetail(page, sellerInfo.store_site);
                const seller: ISeller = { ...sellerInfo, ...sellerDetail };
                sellers.push(seller);
                cnt++;

                if (productIndex > 46) {
                    pageIndex++;
                    productIndex = 1;
                }
            } catch (e) {
                console.log(e);
                continue;
            }
        }

        return sellers;
    }

    // 크롤링 데이터 저장
    saveSellerData(sellers: ISeller[]) {
        sellers.map((seller) => {
            this.sellerService.saveSeller(seller);
        });
    }

    // 상품 순서를 selector로 변환
    getUrlForOption(catId: string, pageIndex: number): string {
        return `https://search.shopping.naver.com/search/category/${catId}?pagingIndex=${pageIndex}&pagingSize=40`;
    }

    // 스마트스토어인지 확인
    checkIsSmartStore(url: string): boolean {
        if (url.includes("smartstore.naver.com") || url.includes("brand.naver.com")) {
            return true;
        }
        return false;
    }
}