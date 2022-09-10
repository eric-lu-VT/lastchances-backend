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
  followedEmail: string; 
  followerId: string;
}
// [followerId] is crushing on [followedEmail]

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
    followedEmail: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.UUID)
    followerId: string;
}

export default Following;