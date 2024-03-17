import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SellerService } from "./seller.service";

@Controller("seller")
export class SellerController {
    constructor(private readonly sellerService: SellerService) {}

    @Get()
    findAll() {
        return this.sellerService.findAll();
    }

    @Get("id/:id")
    findOneById(@Param("id") id: string) {
        return this.sellerService.findOneById(+id);
    }

    @Get("businessNumber/:bn")
    findOneByBn(@Param("bn") business_number: string) {
        return this.sellerService.findOneByBn(business_number);
    }

    @Patch(":id")
    update(@Param("id") id: string) {
        return this.sellerService.update(+id);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.sellerService.remove(+id);
    }
}
