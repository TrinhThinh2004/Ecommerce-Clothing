import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
export interface OrderAttributes {
  order_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
  voucher_code?: string;
  discount_amount: number;
  shipping_fee: number;
  total_price: number;
  payment_method: "cod" | "vnpay" | "momo";
  payment_status: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  created_at?: Date;
  updated_at?: Date;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  | "order_id"
  | "district"
  | "ward"
  | "note"
  | "voucher_code"
  | "discount_amount"
  | "shipping_fee"
  | "payment_status"
  | "status"
  | "created_at"
  | "updated_at"
>;

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public order_id!: number;
  public user_id!: number;
  public full_name!: string;
  public phone!: string;
  public address!: string;
  public city!: string;
  public district?: string;
  public ward?: string;
  public note?: string;
  public voucher_code?: string;
  public discount_amount!: number;
  public shipping_fee!: number;
  public total_price!: number;
  public payment_method!: "cod" | "vnpay" | "momo";
  public payment_status!: "pending" | "paid" | "failed";
  public status!:
    | "pending"
    | "processing"
    | "shipping"
    | "completed"
    | "cancelled";
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public items?: any[];
}

Order.init(
  {
    
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(50), allowNull: false },
    district: { type: DataTypes.STRING(50), allowNull: true },
    ward: { type: DataTypes.STRING(50), allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    voucher_code: { type: DataTypes.STRING(50), allowNull: true },
    discount_amount: { type: DataTypes.DECIMAL(12, 0), allowNull: false, defaultValue: 0 },
    shipping_fee: { type: DataTypes.DECIMAL(12, 0), allowNull: false, defaultValue: 0 },
    total_price: { type: DataTypes.DECIMAL(12, 0), allowNull: false },
    payment_method: {
      type: DataTypes.ENUM("cod", "vnpay", "momo"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipping",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,               // Bật timestamps
    createdAt: "created_at",        // Mapping cột created_at
    updatedAt: "updated_at",        // Mapping cột updated_at
    underscored: true,              // Chuyển camelCase -> snake_case
  }
);
Order.belongsTo(User, { 
  foreignKey: "user_id", 
  as: "user" 
});
export default Order;
