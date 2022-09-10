import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateFollowingRequest } from 'validation/following';
import { followingService } from 'services';

const createFollowing: RequestHandler = async (req: ValidatedRequest<CreateFollowingRequest>, res, next) => {
  try {
    const savedFollowing = await followingService.createFollowing(req.body);
    res.status(201).json(savedFollowing);
  } catch (error) {
    next(error);
  }
};

const getMatches: RequestHandler = async (req, res, next) => {
  try {
    const matches = await followingService.getMatches({ id: req.params.id as string });
    res.status(200).json(matches);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const followingController = {
  createFollowing,
  getMatches,
};

export default followingController;
