import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CrawlingService } from "./crawling.service";
import { CrawlingStoreOption } from "./dto/crawling-store-option.dto";

@Controller("crawling")
export class CrawlingController {
    constructor(private readonly crawlingService: CrawlingService) {}

    @Post("smartstore")
    initCategory(@Body() crawlingStoreOption: CrawlingStoreOption) {
        return this.crawlingService.crawlingSmartStore(crawlingStoreOption);
    }

    @Patch("smartstore/:id")
    updateStore(@Param("id") id: number) {
        return this.crawlingService.updateSmartStore(+id);
    }
}
