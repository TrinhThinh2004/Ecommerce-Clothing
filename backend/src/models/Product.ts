import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
  product_id: number;
  name: string;
  description?: string | null;
  price: number;
  stock_quantity: number;
  image_url?: string | null;
  active: boolean;
  category_id?: number | null;
  brand_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  | "product_id"
  | "description"
  | "image_url"
  | "category_id"
  | "brand_id"
  | "created_at"
  | "updated_at"
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public product_id!: number;
  public name!: string;
  public description!: string | null;
  public price!: number;
  public stock_quantity!: number;
  public image_url!: string | null;
  public active!: boolean;
  public category_id!: number | null;
  public brand_id!: number | null;
  public created_at!: Date;
  public updated_at!: Date;
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "Product",
    timestamps: false,
    underscored: true,
  }
);

export default Product;
import Category from "./Categorys";

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});
