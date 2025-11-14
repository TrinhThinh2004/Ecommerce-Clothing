import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface MessageAttributes {
  message_id: number;
  sender_id: number;
  receiver_id?: number | null;
  content: string;
  is_from_admin?: boolean;
  created_at?: Date;
}

export type MessageCreationAttributes = Optional<
  MessageAttributes,
  "message_id" | "receiver_id" | "is_from_admin" | "created_at"
>;

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public message_id!: number;
  public sender_id!: number;
  public receiver_id!: number | null;
  public content!: string;
  public is_from_admin!: boolean;
  public created_at!: Date;
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

export default Message;
