import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Seller } from "src/seller/entities/seller.entity";

// sequelize를 통한 DB 연결을 모듈화
@Module({})
export class SequelizeConnectModule {
    constructor(private sequelize: Sequelize) {}

    static forRoot(): DynamicModule {
        const sequelizeModule: DynamicModule = SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: "mysql",
                host: configService.get<string>("DATABASE_HOST"),
                port: configService.get<number>("DATABASE_PORT"),
                username: configService.get<string>("DATABASE_USERNAME"),
                password: configService.get<string>("DATABASE_PASSWORD"),
                database: configService.get<string>("DATABASE_NAME"),
                models: [Seller],
                synchronize: process.env.NODE_ENV === "development" ? true : false,
                logging: false,
            }),
            inject: [ConfigService],
        });

        return {
            module: SequelizeConnectModule,
            imports: [sequelizeModule],
            exports: [sequelizeModule],
        };
    }
}
