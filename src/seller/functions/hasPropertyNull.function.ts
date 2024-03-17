import { ISeller } from "src/crawling/interfaces/crawling.interface";

export function hasPropertyNull(seller: ISeller): boolean {
    Object.keys(seller).map((prop, idx) => {
        if (!seller[prop]) return true;
    });
    return false;
}
