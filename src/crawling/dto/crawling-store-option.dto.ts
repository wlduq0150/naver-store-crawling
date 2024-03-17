import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CrawlingStoreOption {
    @IsString()
    @ApiProperty({ description: "네이버 스토어 카테고리 아이디", default: "100000002" })
    catId: string;

    @IsNumber()
    @ApiProperty({ description: "네이버 스토어 크롤링 시작 페이지", default: 5 })
    pageIndex: number;

    @IsNumber()
    @ApiProperty({ description: "네이버 스토어 크롤링 시작 상품", default: 9 })
    productIndex: number;

    @IsNumber()
    @ApiProperty({ description: "상품 크롤링 개수", default: 5 })
    num: number;
}
