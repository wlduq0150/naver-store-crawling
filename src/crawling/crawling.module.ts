import { Module } from "@nestjs/common";
import { CrawlingController } from "./crawling.controller";
import { CrawlingService } from "./crawling.service";
import { SellerModule } from "src/seller/seller.module";

@Module({
    imports: [SellerModule],
    controllers: [CrawlingController],
    providers: [CrawlingService],
})
export class CrawlingModule {}
