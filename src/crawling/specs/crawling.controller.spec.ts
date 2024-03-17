import { Test, TestingModule } from "@nestjs/testing";
import { CrawlingController } from "../crawling.controller";

describe("CrawlingController", () => {
    let controller: CrawlingController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CrawlingController],
        }).compile();

        controller = module.get<CrawlingController>(CrawlingController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
