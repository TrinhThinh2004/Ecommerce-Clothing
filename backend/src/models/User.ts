import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface cho User attributes
export interface UserAttributes {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  refresh_token?: string | null;
  phone_number?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  role: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
}

// Interface cho việc tạo User (các trường optional)
export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'user_id' 
  | 'refresh_token'
  | 'phone_number' 
  | 'address'
  | 'date_of_birth' 
  | 'gender' 
  | 'created_at' 
  | 'updated_at'
>;

// User Model Class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  // Attributes
  public user_id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public refresh_token!: string | null;
  public phone_number!: string | null;
  public address!: string | null;
  public date_of_birth!: string | null;
  public gender!: 'male' | 'female' | 'other' | null;
  public role!: 'admin' | 'user';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // ==================== Helper Methods ====================
  
  // Kiểm tra xem user có phải admin không
  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  // Kiểm tra xem user có phải user thường không
  public isUser(): boolean {
    return this.role === 'user';
  }

  // Kiểm tra quyền truy cập
  public hasPermission(requiredRole: 'admin' | 'user'): boolean {
    const roleHierarchy = { admin: 2, user: 1 };
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }

  // Lấy initials cho avatar
  public getInitials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }

  // Convert to JSON (loại bỏ sensitive data)
  public toSafeJSON(): Omit<UserAttributes, 'password_hash' | 'refresh_token'> {
    const values = { ...this.get() } as UserAttributes;
    const { password_hash, refresh_token, ...safeValues } = values;
    return safeValues;
  }

  // ==================== Associations ====================
  public static associate(models: any): void {
    // User has many Messages
    User.hasMany(models.Message, { 
      foreignKey: 'sender_id', 
      as: 'sentMessages' 
    });
    
    // User has many Orders
    User.hasMany(models.Order, { 
      foreignKey: 'user_id', 
      as: 'orders' 
    });
    
    // User has many Reviews
    User.hasMany(models.Review, { 
      foreignKey: 'user_id', 
      as: 'reviews' 
    });
    
    // User has one Cart
    User.hasOne(models.Cart, { 
      foreignKey: 'user_id', 
      as: 'cart' 
    });
  }
}

// ==================== Initialize Model ====================
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: 'Primary key - User ID',
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        name: 'unique_username',
        msg: 'Username already exists',
      },
      validate: {
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 characters',
        },
        notEmpty: {
          msg: 'Username cannot be empty',
        },
      },
      comment: 'Unique username for login',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'unique_email',
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
        notEmpty: {
          msg: 'Email cannot be empty',
        },
      },
      comment: 'User email address',
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password hash cannot be empty',
        },
      },
      comment: 'Hashed password',
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'JWT refresh token',
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9+\-\s()]*$/,
          msg: 'Phone number can only contain numbers and +, -, (, ), spaces',
        },
      },
      comment: 'User phone number',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Address must be less than 500 characters',
        },
      },
      comment: 'User address',
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          args: true,
          msg: 'Must be a valid date',
        },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Date of birth must be in the past',
        },
      },
      comment: 'User date of birth (YYYY-MM-DD)',
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
      validate: {
        isIn: {
          args: [['male', 'female', 'other']],
          msg: 'Gender must be male, female, or other',
        },
      },
      comment: 'User gender',
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['admin', 'user']],
          msg: 'Role must be admin or user',
        },
      },
      comment: 'User role (admin or user)',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Record creation timestamp',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Record last update timestamp',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: false, // Chúng ta tự quản lý created_at và updated_at
    underscored: true, // Sử dụng snake_case cho tên cột
    indexes: [
      {
        name: 'idx_users_email',
        fields: ['email'],
      },
      {
        name: 'idx_users_username',
        fields: ['username'],
      },
      {
        name: 'idx_users_role',
        fields: ['role'],
      },
    ],
    hooks: {
      // Hook before create
      beforeCreate: (user: User) => {
      
      },
      // Hook after create
      afterCreate: (user: User) => {
        
      },
      // Hook before update
      beforeUpdate: (user: User) => {
     
      },
      // Hook after update
      afterUpdate: (user: User) => {
       
      },
    },
  }
);

export default User;