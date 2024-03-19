import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({ tableName: "sellers", underscored: true })
export class Seller extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    category: string;

    @Column({ type: DataType.STRING, allowNull: false })
    shopName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    companyName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    ceo: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    buisnessNumber: string;

    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    storeSite: string;

    @Column({ type: DataType.ENUM("male", "female"), allowNull: false })
    preferedGender: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    averageAge: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    customerNumbers: number;
}
