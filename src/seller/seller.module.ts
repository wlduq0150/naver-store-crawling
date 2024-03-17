import { Module, Scope } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerController } from "./seller.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Seller } from "./entities/seller.entity";

const sellerProvider = {
    provide: "SELLER",
    useValue: Seller,
    Scope: Scope.DEFAULT,
};

@Module({
    imports: [SequelizeModule.forFeature([Seller])],
    exports: [SellerService, sellerProvider],
    controllers: [SellerController],
    providers: [SellerService, sellerProvider],
})
export class SellerModule {}
