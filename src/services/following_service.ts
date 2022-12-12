// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import FollowingModel, { IFollowing } from 'db/models/following';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import { IUser } from 'db/models/user';
import userService from './user_service';
import db from '../db/db';

export interface FollowingParams {
  id?: string;
  followedName?: string;
  followedNetId?: string;
  followerNetId?: string;
  followerUserId?: string;
}

const constructQuery = (params: FollowingParams) => {
  const { id, followedName, followedNetId, followerNetId, followerUserId } = params;
  const query: DatabaseQuery<FollowingParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (followedName) {
    query.where.followedName = {
      [Op.eq]: followedName,
    };
  }
  if (followedNetId) {
    query.where.followedNetId = {
      [Op.eq]: followedNetId,
    };
  }
  if (followerNetId) {
    query.where.followerNetId = {
      [Op.eq]: followerNetId,
    };
  }
  if (followerUserId) {
    query.where.followerUserId = {
      [Op.eq]: followerUserId,
    };
  }
  return query;
};

const getFollowings = async (params: FollowingParams) => {
  try {
    const query = constructQuery(params);
    return await FollowingModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

interface MatchesOutParams {
  rows: IFollowing[];
}

// TODO: Fix
const getMatches = async (params: Pick<IUser, 'id'>) => {
  try {
    const netid = await userService.getUsers({ id: params.id }).then((res) => res[0].netid);
    const queryResult = await db.query(`SELECT following."id", following."followedName", following."followedEmail", following."followerId" FROM following \
      INNER JOIN users on lower(users."email")=lower(following."followedEmail") WHERE following."followerId"='${params.id}' \
      and EXISTS (SELECT following."followedEmail" FROM following WHERE lower(following."followedEmail")=lower('${netid}}'))`);
    
    const res : MatchesOutParams = queryResult[1] as MatchesOutParams;
    console.log(res.rows);
    return res.rows;
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateFollowings = async (resource: Partial<IFollowing>, params: FollowingParams) => {
  const query = constructQuery(params);
  return (await FollowingModel.update(resource, { ...query, returning: true }))[1];
};

const deleteFollowings = async (params: FollowingParams) => {
  const query = constructQuery(params);
  try {
    return await FollowingModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const createFollowing = async (params: Omit<IFollowing, 'id'>) => {
  try {
    return await FollowingModel.create({ 
      ...params, 
      id: uuidv4(),
    });
  } catch (e : any) {
    throw e;
  }
};

const resourceService = {
  getFollowings,
  updateFollowings,
  deleteFollowings,
  createFollowing,
  getMatches,
};

export default resourceService;
