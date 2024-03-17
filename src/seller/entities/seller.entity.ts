import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table
export class Seller extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    category: string;

    @Column({ type: DataType.STRING, allowNull: false })
    shop_name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    company_name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    ceo: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    buisness_number: string;

    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    store_site: string;

    @Column({ type: DataType.ENUM("male", "female"), allowNull: false })
    prefered_gender: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    average_age: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    customer_numbers: number;
}
