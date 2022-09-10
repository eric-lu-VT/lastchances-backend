import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IFollowing } from '../db/models/following';

export const CreateFollowingSchema = joi.object<IFollowing>({
  followedName: joi.string().required().error(() => 'Create following expecting a followed name'),
  followedEmail: joi.string().email().required().error(() => 'Create following expecting a followed email'),
  followerId: joi.string().required().error(() => 'Create following expecting a followerId'),
});

export interface CreateFollowingRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IFollowing
}