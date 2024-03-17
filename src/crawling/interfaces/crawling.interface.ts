import { Model } from "sequelize-typescript";
import { Seller } from "src/seller/entities/seller.entity";

export interface ISeller extends Omit<Seller, keyof Model> {}

export interface SellerInfo
    extends Pick<Seller, "category" | "shop_name" | "buisness_number" | "address" | "store_site"> {}

export interface SellerDetail
    extends Pick<
        Seller,
        "company_name" | "ceo" | "prefered_gender" | "average_age" | "customer_numbers"
    > {}
