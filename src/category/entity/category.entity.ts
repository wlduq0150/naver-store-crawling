import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({})
export class Category extends Model {
    @Column({ type: DataType.STRING, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    keyword: string;
}
