/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from 'express';
import { dartService } from 'services';

const getDartUsers: RequestHandler = async (req, res, next) => {
  try {
    // ! Only allow user to search for certain fields
    const first_name = req.query.first_name as string;
    const middle_name = req.query.middle_name as string;
    const last_name = req.query.last_name as string;
    
    const jwt = await dartService.getDartJWT();
    const users = await dartService.getDartUsers({ first_name, middle_name, last_name, jwt });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const dartController = {
  getDartUsers,
};

export default dartController;