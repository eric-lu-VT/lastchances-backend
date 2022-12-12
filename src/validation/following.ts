import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IFollowing } from '../db/models/following';

export const CreateFollowingSchema = joi.object<IFollowing>({
  followedName: joi.string().required().error(() => new Error('Create following expecting a followed name')),
  followedNetId: joi.string().required().error(() => new Error('Create following expecting a followedNetId')),
  followerNetId: joi.string().required().error(() => new Error('Create following expecting a followerNetId')),
  followerUserId: joi.string().required().error(() => new Error('Create following expecting a followerUserId')),
});

export interface CreateFollowingRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IFollowing
}