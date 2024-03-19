import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    @Get("/healthCheck")
    healthCheck() {
        return "success";
    }
}
