import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindSellerByOptionDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "카테고리 분류", default: "남성의류" })
    catId?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "회사 위치", default: "서울" })
    region?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "선호 성별", default: "male" })
    prefered_gender?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "최소 연령대", default: 20 })
    min_age?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "최대 연령대", default: 40 })
    max_age?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "관심 고객수 정렬 기준(desc, asc)", default: "desc" })
    sort_by_customers: string;
}
