import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { Seller } from "./entities/seller.entity";
import { ISeller, SellerDetail } from "src/crawling/interfaces/crawling.interface";
import { hasPropertyNull } from "./functions/has-property-null.function";
import { FindSellerByOptionDto } from "./dto/find-by-option.dto";
import { Op, Order, WhereOptions } from "sequelize";

@Injectable()
export class SellerService {
    constructor(@Inject("SELLER") private readonly sellerRepository: typeof Seller) {}

    // 판매자 정보 삽입
    async saveSeller(seller: ISeller): Promise<boolean> {
        // 판매자 정보에 null 값이 있는지 확인
        const hasSellerPropertyNull = hasPropertyNull(seller);
        if (hasSellerPropertyNull) {
            console.log("잘못된 판매자 정보입니다.");
            return false;
        }

        // 이미 판매자 정보가 존재하는지 확인
        const isAlreadyExist = await this.findOneByBn(seller.buisnessNumber);
        if (isAlreadyExist) {
            console.log("이미 존재하는 판매자입니다.");
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

    // 전체 카테고리 조회
    async findAllCategorys() {
        const sellers = await this.sellerRepository.findAll({
            attributes: ["category"],
            group: ["category"],
        });
        const categorys = sellers.map((seller) => seller.category);
        return categorys;
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

    // 옵션으로 조회
    async findAllByOption(findOption: FindSellerByOptionDto) {
        const where: WhereOptions<any> = {};
        const order: Order = [];

        // 카테고리 아이디
        if ("catId" in findOption) {
            where["category"] = findOption["catId"];
        }

        // 지역
        if ("region" in findOption) {
            where["address"] = {
                [Op.like]: `%${findOption["region"]}%`,
            };
        }

        // 선호성별
        if ("prefered_gender" in findOption) {
            where["prefered_gender"] = findOption["prefered_gender"];
        }

        // 연령대
        if ("min_age" in findOption || "max_age" in findOption) {
            where["average_age"] = {
                [Op.and]: [
                    { [Op.gte]: findOption["min_age"] ? +findOption["min_age"] : 0 },
                    { [Op.lte]: findOption["max_age"] ? +findOption["max_age"] : 100 },
                ],
            };
        }

        // 관심 고객 수 기준 정렬
        if ("sort_by_customers" in findOption) {
            order.push(["customer_numbers", findOption["sort_by_customers"]]);
        }

        const sellers = await this.sellerRepository.findAll({ where, order });
        return sellers;
    }

    async updateSeller(id: number, sellerDetail: SellerDetail) {
        return await this.sellerRepository.update(
            {
                ...sellerDetail,
            },
            {
                where: { id },
            },
        );
    }

    async removeSeller(id: number) {
        return await this.sellerRepository.destroy({
            where: { id },
        });
    }
}
