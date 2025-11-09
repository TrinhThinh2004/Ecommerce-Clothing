import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";

export interface CartAttributes {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size?: string | null;
  price_snapshot: number;
  created_at?: Date;
  updated_at?: Date;
}

export type CartCreationAttributes = Optional<
  CartAttributes,
  "cart_id" | "created_at" | "updated_at"
>;

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public cart_id!: number;
  public user_id!: number;
  public product_id!: number;
  public quantity!: number;
  public size!: string | null;
  public price_snapshot!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Cart.init(
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_snapshot: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
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
    tableName: "cart", // 👈 khớp với migration
    modelName: "Cart",
    timestamps: false, // vì bạn dùng created_at / updated_at thủ công
    underscored: true,
  }
);

// Quan hệ: mỗi item trong giỏ thuộc về 1 sản phẩm
Cart.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

export default Cart;
