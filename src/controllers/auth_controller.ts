import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import env from 'env-var';
import { RequestHandler } from 'express';
import { userService, dartService } from 'services';
import { IUser } from 'db/models/user';
import { RequestWithJWT } from 'auth/requests';

dotenv.config();

const tokenForUser = (user: IUser): string => {
  const timestamp = new Date().getTime();
  const exp = Math.round((timestamp + 2.628e+9) / 1000);
  return jwt.encode({ sub: user.id, iat: timestamp, exp }, env.get('AUTH_SECRET').required().asString());
};

const jwtSignIn: RequestHandler = (req: RequestWithJWT, res) => (
  res.json({ user: req.user })
);

// TODO: Add type for req
const casSignIn: RequestHandler = async (req: any, res, next) => {
  try {
    console.log('auth_controller casSignIn:', req.user);
  
    const users: IUser[] = await userService.getUsers({ netid: req.user.attributes.netid });
    if (users.length > 1) {
      throw new Error('more than one user');
    } else if (users.length <= 0) {
      const dartJWT = await dartService.getDartJWT(); 
      const user = await dartService.getDartUserFromNetId({ netid: req.user.attributes.netid, jwt: dartJWT });
  
      // Make a new user from passed data
      const savedUser = await userService.createUser({
        netid: user.netid,
        email: user.email,
        name: user.name,
      });
  
      res.redirect(`${process.env.FRONTEND_URL}?token=${tokenForUser(savedUser)}`);
    } else { // user.length === 1
      res.redirect(`${process.env.FRONTEND_URL}?token=${tokenForUser(users[0])}`);
    }
  } catch (error) {
    next(error);
  }
};

const authController = {
  jwtSignIn,
  casSignIn,
};

export default authController;
