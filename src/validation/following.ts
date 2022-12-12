import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IFollowing } from '../db/models/following';

export const CreateFollowingSchema = joi.object<IFollowing>({
  followedName: joi.string().required().error(() => new Error('Create following expecting a followed name')),
  followedNetId: joi.string().required().error(() => new Error('Create following expecting a followedNetID')),
  followerNetId: joi.string().required().error(() => new Error('Create following expecting a followerNetId')),
});

export interface CreateFollowingRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IFollowing
}