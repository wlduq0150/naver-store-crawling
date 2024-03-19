import { Model } from "sequelize-typescript";
import { Seller } from "src/seller/entities/seller.entity";

export interface ISeller extends Omit<Seller, keyof Model> {}

export interface SellerInfo
    extends Pick<Seller, "category" | "shopName" | "buisnessNumber" | "address" | "storeSite"> {}

export interface SellerDetail
    extends Pick<
        Seller,
        "companyName" | "ceo" | "preferedGender" | "averageAge" | "customerNumbers"
    > {}
