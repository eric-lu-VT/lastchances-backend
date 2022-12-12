import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IUser } from 'db/models/user';

export const SignUpUserSchema = joi.object<IUser>({
  netid: joi.string().required().error(() => new Error('Signup expecting a netid')),
  email: joi.string().email().required().error(() => new Error('Signup user expecting an email')),
});

export interface SignUpUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IUser
}