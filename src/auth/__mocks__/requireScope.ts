import { RequestHandler } from 'express';
// import { ScopeNames } from 'authentication/scopes';
import { IUser } from '../../db/models/user';

const mockUser: Omit<IUser, 'id' | 'role'> = {
  netid: 'f0056mr',
  email: 'eric.j.lu.25@dartmouth.edu',
  name: 'Eric Lu',
};

const requireScope = (): RequestHandler => (req, res, next) => {
  // Reject with 403 if user scope is not sufficient
  if (!req.get('Authorization')) return res.status(403).json({ message: 'Unauthorized' });

  req.user = mockUser;
  return next();
};

export default requireScope;
