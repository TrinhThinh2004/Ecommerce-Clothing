import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Order from "./Order";
import Product from "./Product";

export interface OrderItemAttributes {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  unit_price: number;
  subtotal: number;
  created_at?: Date;
}

export type OrderItemCreationAttributes = Optional<
  OrderItemAttributes,
  "order_item_id" | "size" | "created_at"
>;

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public order_item_id!: number;
  public order_id!: number;
  public product_id!: number;
  public quantity!: number;
  public size?: string;
  public unit_price!: number;
  public subtotal!: number;
  public created_at!: Date;
}

OrderItem.init(
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    size: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 0),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "order_items",
    modelName: "OrderItem",
    timestamps: false,
    underscored: true,
  }
);

// Associations
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export default OrderItem;
