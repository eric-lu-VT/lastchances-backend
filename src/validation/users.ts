import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IUser } from '../db/models/user';

export const CreateUserSchema = joi.object<IUser>({
  netid: joi.string().required().error(() => new Error('Create user expecting a name')),
  email: joi.string().email().required().error(() => new Error('Create user expecting an id')),
  name: joi.string().required().error(() => new Error('Create user expecting a name')),
});

export interface CreateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IUser
}

export const UpdateUserSchema = joi.object<IUser>({
  id: joi.string(),
  netid: joi.string(),
  email: joi.string().email(),
  name: joi.string(),
  role: joi.string(),
});

export interface UpdateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IUser>
}
