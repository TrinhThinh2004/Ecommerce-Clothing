// src/models/Category.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database"; // Giả định
import Product from "./Product";

// Định nghĩa Interface
export interface CategoryAttributes {
  category_id: number;
  name: string;
  parent_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type CategoryCreationAttributes = Optional<CategoryAttributes, "category_id" | "parent_id" | "created_at" | "updated_at">;

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public category_id!: number;
  public name!: string;
  public parent_id!: number | null;
  public created_at!: Date;
  public updated_at!: Date;
}

Category.init({
  category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categories', key: 'category_id' },
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: "categories",
  modelName: "Category",
  timestamps: false,
  underscored: true,
});

// Thiết lập mối quan hệ
Category.hasMany(Product, { foreignKey: "category_id", as: "products" }); // 1-n với Sản phẩm
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' }); // Tự tham chiếu (Con)
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' }); // Tự tham chiếu (Cha)

export default Category;