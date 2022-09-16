import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateFollowingRequest } from 'validation/following';
import { followingService } from 'services';
import { IFollowing } from 'db/models/following';
import { BaseError } from 'errors';

const createFollowing: RequestHandler = async (req: ValidatedRequest<CreateFollowingRequest>, res, next) => {
  try {
    const followings: IFollowing[] = await followingService.getFollowings({ followerId: req.params.id });
    if (followings.length >= 10) {
      throw new BaseError('You cannot create more than 10 crushes', 409);
    }

    const savedFollowing: IFollowing = await followingService.createFollowing(req.body);
    res.status(201).json(savedFollowing);
  } catch (error) {
    next(error);
  }
};

const getFollowings: RequestHandler = async (req, res, next) =>  {
  try {
    const followings: IFollowing[] = await followingService.getFollowings({ followerId: req.params.id });
    res.status(200).json(followings);
  } catch (error) {
    next(error);
  }
};

const getMatches: RequestHandler = async (req, res, next) => {
  try {
    const matches = await followingService.getMatches({ id: req.params.id });
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
};

const followingController = {
  createFollowing,
  getFollowings,
  getMatches,
};

export default followingController;
