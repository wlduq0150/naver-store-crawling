import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { FindSellerByOptionDto } from "./dto/find-by-option.dto";

@Controller("seller")
export class SellerController {
    constructor(private readonly sellerService: SellerService) {}

    @Get()
    findAll() {
        return this.sellerService.findAll();
    }

    @Get("option")
    findAllByOption(@Query() findOption: FindSellerByOptionDto) {
        return this.sellerService.findAllByOption(findOption);
    }

    @Get("categorys")
    findCategorys() {
        return this.sellerService.findAllCategorys();
    }

    @Get(":id")
    findOneById(@Param("id") id: string) {
        return this.sellerService.findOneById(+id);
    }

    @Delete(":id")
    removeSeller(@Param("id") id: string) {
        return this.sellerService.removeSeller(+id);
    }
}
