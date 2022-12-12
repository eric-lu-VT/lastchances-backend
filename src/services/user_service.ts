// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import UserModel, { IUser, UserScopes } from 'db/models/user';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';

export interface UserParams {
  id?: string;
  netid?: string;
  email?: string;
  name?: string;
  role?: string;

  limit?: number;
  offset?: number;
}

const constructQuery = (params: UserParams) => {
  const { id, netid, email, name, role, limit = 30, offset = 0 } = params;
  const query: DatabaseQuery<UserParams> & {
    attributes: { exclude: string[] };
  } = {
    where: {},
    attributes: { exclude: ['password'] },
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (netid) {
    query.where.netid = {
      [Op.eq]: netid,
    };
  }
  if (email) {
    query.where.email = {
      [Op.eq]: email,
    };
  }
  if (name) {
    query.where.name = {
      [Op.eq]: name,
    };
  }
  if (role) {
    query.where.role = {
      [Op.eq]: role,
    };
  }
  if (limit) {
    query.limit = limit;
  }
  if (offset) {
    query.offset = offset;
  }
  return query;
};

const getUsers = async (params: Omit<UserParams, 'password'>) => {
  const query = constructQuery(params);
  try {
    return await UserModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const editUsers = async (user: Partial<IUser>, params: UserParams) => {
  const query = constructQuery(params);
  return (await UserModel.update(user, { ...query, returning: true }))[1];
};

const deleteUsers = async (params: UserParams) => {
  const query = constructQuery(params);
  try {
    return await UserModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const createUser = async (user: Pick<IUser, 'netid' | 'email' | 'name'>) => {
  // check for inactive account with this email
  // db-level unique constraint on email; can assume only one user if any
  const usersSameEmail = await getUsers({
    email: user.email,
  });

  if (usersSameEmail.length == 0) {
    try {
      return await UserModel.create({ 
        ...user, 
        id: uuidv4(),
        role: UserScopes.User,
      });
    } catch (e : any) {
      throw new BaseError(e.message, 500);
    }
  } else {
    throw new BaseError('Email address already associated to a user', 409);
  }
};

const userService = {
  createUser,
  getUsers,
  editUsers,
  deleteUsers,
};

export default userService;
