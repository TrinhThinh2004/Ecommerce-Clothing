import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  refresh_token?: string | null;
  phone_number?: string | null;
  role: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'user_id' | 'phone_number' | 'created_at' | 'updated_at'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public refresh_token!: string | null;
  public phone_number!: string | null;
  public role!: 'admin' | 'user';
  public created_at!: Date;
  public updated_at!: Date;

  // Helper methods
  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isUser(): boolean {
    return this.role === 'user';
  }

  public hasPermission(requiredRole: 'admin' | 'user'): boolean {
    const roleHierarchy = { admin: 2, user: 1 };
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }
  
  // Associations
  public static associate(models: any): void {
    User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'sentMessages' });
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+\-\s()]*$/,
      },
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: [['admin', 'user']],
      },
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
    tableName: 'users',
    modelName: 'User',
    timestamps: false,
    underscored: true,
  }
);

export default User;
