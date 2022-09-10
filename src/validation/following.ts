import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IFollowing } from '../db/models/following';

export const CreateFollowingSchema = joi.object<IFollowing>({
  followedEmail: joi.string().email().required().error(() => 'Create following expecting a title'),
  followerId: joi.string().required().error(() => 'Create following expecting a description'),
});

export interface CreateFollowingRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IFollowing
}