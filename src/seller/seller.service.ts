import { Inject, Injectable } from "@nestjs/common";
import { Seller } from "./entities/seller.entity";
import { ISeller } from "src/crawling/interfaces/crawling.interface";
import { hasPropertyNull } from "./functions/hasPropertyNull.function";

@Injectable()
export class SellerService {
    constructor(@Inject("SELLER") private readonly sellerRepository: typeof Seller) {}

    // 판매자 정보 삽입
    async saveSeller(seller: ISeller): Promise<boolean> {
        // 판매자 정보에 null 값이 있는지 확인
        const hasSellerPropertyNull = hasPropertyNull(seller);
        if (hasSellerPropertyNull) {
            return false;
        }

        // 이미 판매자 정보가 존재하는지 확인
        const isAlreadyExist = await this.findOneByBn(seller.buisness_number);
        if (isAlreadyExist) {
            return false;
        }

        // 판매자 정보 저장
        this.sellerRepository.create({
            ...seller,
        });

        return true;
    }

    // 전체 조회
    async findAll() {
        return await this.sellerRepository.findAll();
    }

    // 아이디로 조회
    async findOneById(id: number) {
        return await this.sellerRepository.findOne({
            where: {
                id,
            },
        });
    }

    // 사업자등록번호로 조회
    async findOneByBn(buisness_number: string) {
        return await this.sellerRepository.findOne({
            where: {
                buisness_number,
            },
        });
    }

    update(id: number) {
        return `This action updates a #${id} seller`;
    }

    remove(id: number) {
        return `This action removes a #${id} seller`;
    }
}
