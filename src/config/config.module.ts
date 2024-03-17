import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

const configModule = ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
    isGlobal: true,
});

@Module({
    imports: [configModule],
})
export class SetConfigModule {}
