import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SetConfigModule } from "./config/config.module";
import { CrawlingModule } from "./crawling/crawling.module";
import { SequelizeConnectModule } from "./sequelize-connect/sequelize-connect.module";
import { SellerModule } from "./seller/seller.module";

@Module({
    imports: [SetConfigModule, CrawlingModule, SequelizeConnectModule.forRoot(), SellerModule],
    controllers: [AppController],
})
export class AppModule {}
