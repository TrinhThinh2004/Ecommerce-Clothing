import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export interface MessageAttributes {
  message_id: number;
  sender_id: number;
  owner_id?: number | null;
  receiver_id?: number | null;
  content: string;
  is_from_admin?: boolean;
  created_at?: Date;
}

export type MessageCreationAttributes = Optional<
  MessageAttributes,
  "message_id" | "receiver_id" | "is_from_admin" | "created_at" | "owner_id"
>;

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public message_id!: number;
  public sender_id!: number;
  public owner_id!: number | null;
  public receiver_id!: number | null;
  public content!: string;
  public is_from_admin!: boolean;
  public created_at!: Date;
  
  // Define associations so models/index can wire them
  public static associate(models: any): void {
    Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
  }
  
  // Also set up a direct relation to `User` so includes using the `sender` alias work
  // even when models/index loader doesn't call `.associate` (e.g. ts-node runtime).
}

Message.init(
  {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_from_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "messages",
    modelName: "Message",
    timestamps: false,
    underscored: true,
  }
);

// Direct association: attach sender relation after init so `include: { as: 'sender' }` works
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

export default Message;
