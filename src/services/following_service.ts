// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import FollowingModel, { IFollowing } from 'db/models/following';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import { IUser } from 'db/models/user';
import db from '../db/db';

export interface FollowingParams {
  id?: string;
  followedEmail?: string;
  followerId?: string;
}

const constructQuery = (params: FollowingParams) => {
  const { id, followedEmail, followerId } = params;
  const query: DatabaseQuery<FollowingParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (followedEmail) {
    query.where.followedEmail = {
      [Op.eq]: followedEmail,
    };
  }
  if (followerId) {
    query.where.followerId = {
      [Op.eq]: followerId,
    };
  }
  return query;
};

const getFollowings = async (params: FollowingParams) => {
  const query = constructQuery(params);
  try {
    return await FollowingModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const getMatches = async (params: Pick<IUser, 'id' | 'email'>) => {
  try {
    return await db.query(`SELECT following."id", following."followedEmail", following."followerId" FROM following INNER JOIN users on users."email"=following."followedEmail" \
    WHERE following."followerId"='${params.id}' and EXISTS (SELECT following."followedEmail" FROM following WHERE following."followedEmail"='${params.email}')`);
  } catch (e : any) {
    console.log(e);
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
