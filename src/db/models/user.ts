import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import Following from './following';

export enum UserScopes {
  User = 'USER',
  Admin = 'ADMIN',
}

export interface IUser {
  id: string;
  netid: string;
  email: string;
  name: string;
  role: UserScopes;
}

@Table({
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      unique: true,
      fields: ['netid'],
    },
  ],
})
class User extends Model<IUser> implements IUser {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
    netid: string;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
    email: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    name: string;

  @AllowNull(false)
  @Column(DataTypes.ENUM({ values: ['UNVERIFIED', 'USER', 'ADMIN'] }))
    role: UserScopes;

  @HasMany(() => Following)
    following: Following[];
}

export default User;