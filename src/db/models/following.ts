import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import User from './user';

export interface IFollowing {
  id: string;
  followedName: string;
  followedNetId: string; 
  followerNetId: string;
  followerUserId: string;
}
// [followerNetId] is crushing on [followedNetId]

@Table({
  tableName: 'following',
})
class Following extends Model<IFollowing> implements IFollowing {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column({ type: DataTypes.UUID })
    id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    followedName: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    followedNetId: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
    followerNetId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    followerUserId: string;
}

export default Following;