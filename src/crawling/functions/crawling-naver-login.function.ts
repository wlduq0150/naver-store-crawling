import { Page } from "puppeteer";
import { NAVER_LOGIN_HOME_URL } from "../constants/crawling-url.constant";
import {
    NAVER_LOGIN_PAGE_BUTTON,
    NAVER_LOGIN_SUBMIT_BUTTON,
} from "../constants/crawling-selector.constant";
import { waitForSeconds } from "./crawling-wait.function";

// 네이버 로그인
export async function naverPageLogin(page: Page, id: string, pw: string) {
    try {
        // 네이버 홈페이지 이동
        await page.goto(NAVER_LOGIN_HOME_URL);
        await waitForSeconds(1);

        // 1초동안 id, pw를 입력하기(매크로 방지 뚫기)
        await waitForSeconds(1);
        await page.click("#id");
        await page.keyboard.type(id, { delay: 100 });
        await page.click("#pw");
        await page.keyboard.type(pw, { delay: 100 });

        // 로그인 버튼 클릭후 잠시 대기
        await page.click(NAVER_LOGIN_SUBMIT_BUTTON);
        await waitForSeconds(1);

        // 홈페이지로 돌아와진다면 로그인 성공
        if (page.url() === NAVER_LOGIN_HOME_URL) {
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}
