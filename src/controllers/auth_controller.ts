import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import env from 'env-var';
import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { userService, verificationCodeService, dartService } from 'services';
import { IUser } from 'db/models/user';
import { RequestWithJWT } from 'auth/requests';
import { ResendCodeRequest, SignUpUserRequest, VerifyUserRequest } from 'validation/auth';
import { BaseError } from 'errors';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);


// Delete password field when sending through HTTP
const protectUserResponse = (user: IUser): Omit<IUser, 'password'> => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

const tokenForUser = (user: IUser): string => {
  const timestamp = new Date().getTime();
  const exp = Math.round((timestamp + 2.628e+9) / 1000);
  return jwt.encode({ sub: user.id, iat: timestamp, exp }, env.get('AUTH_SECRET').required().asString());
};

const signUpUser: RequestHandler = async (req: ValidatedRequest<SignUpUserRequest>, res, next) => {
  try {
    const {
      email, password,
    } = req.body;
    
    const dartJWT = await dartService.getDartJWT(); 
    const user = await dartService.getDartUserFromEmail({ email, jwt: dartJWT });

    // Make a new user from passed data
    const savedUser = await userService.createUser({
      email,
      password,
      name: user.name,
    });

    const codePayload = await verificationCodeService.createVerificationCode({ email });
    const message = {
      to: email,
      from: process.env.SENDGRID_EMAIL as string,
      subject: 'Verification Code',
      html:  `<html><p>You must enter this code in the app before you can gain access. Your code is:</p><p>${codePayload.code}</p><p>It will expire in 5 minutes.</p></html>`,
    };
    sgMail
      .send(message)
      .then(() => console.log(`Email sent to ${email}`))
      .catch((e) => {
        throw e;
      });

    // Save the user then transmit to frontend
    res.status(201).json({ token: tokenForUser(savedUser), user: protectUserResponse(savedUser) });
  } catch (error : any) {
    next(error);
  }
};

const signInUser: RequestHandler = (req: RequestWithJWT, res) => (
  res.json({ token: tokenForUser(req.user), user: protectUserResponse(req.user) })
);

const jwtSignIn: RequestHandler = (req: RequestWithJWT, res) => (
  res.json({ user: protectUserResponse(req.user) })
);

const resendCode: RequestHandler = async (req: ValidatedRequest<ResendCodeRequest>, res, next) => {
  try {
    const {
      email,
    } = req.body;

    const users: IUser[] = await userService.getUsers({ email });
    if (users.length === 0) throw new BaseError('No user with that email', 400);
    
    const codePayload = await verificationCodeService.createVerificationCode({ email });
    const message = {
      to: email,
      from: process.env.SENDGRID_EMAIL as string,
      subject: 'Verification Code',
      html:  `<html><p>You must enter this code in the app before you can gain access. Your code is:</p><p>${codePayload.code}</p><p>It will expire in 5 minutes.</p></html>`,
    };
    sgMail
      .send(message)
      .then(() => console.log(`Email sent to ${email}`))
      .catch((e) => {
        throw e;
      });
       
    res.sendStatus(201);
  } catch (e: any) {
    next(e);
  }
}; 

const verifyUser: RequestHandler = async (req: ValidatedRequest<VerifyUserRequest>, res, next) => {
  try {
    const {
      email, code,
    } = req.body;

    const user = await verificationCodeService.verifyVerificationCode({ email, code });

    res.status(200).json({ token: tokenForUser(user), user });
  } catch (error : any) {
    next(error);
  }
};

const authController = {
  signUpUser,
  signInUser,
  jwtSignIn,
  resendCode,
  verifyUser,
};

export default authController;
