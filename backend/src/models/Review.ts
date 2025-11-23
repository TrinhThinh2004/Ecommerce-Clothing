import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import Product from "./Product";

interface ReviewAttributes {
  review_id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "review_id" | "created_at" | "updated_at"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public review_id!: number;
  public product_id!: number;
  public user_id!: number;
  public rating!: number;
  public comment!: string;
  public status!: "pending" | "approved" | "rejected";
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
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
    tableName: "reviews",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// ✅ Associations
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });

export default Review;