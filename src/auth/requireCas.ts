/* eslint-disable func-names */
import passport from 'passport';
import cas from 'passport-cas';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
// import { userService } from 'services';
// import { IUser } from 'db/models/user';

dotenv.config();

passport.use(
  'cas',
  new cas.Strategy(
    {
      version: 'CAS3.0',
      ssoBaseURL: 'https://login.dartmouth.edu/cas',
      serverBaseURL: `${process.env.SERVER_URL}/auth/cas-signin`,
    },
    function (profile, done) {
      try {
        return done(null, profile);
      } catch (e) {
        done(e);
      }
    },
  ),
);

// Create function to transmit result of authenticate() call to profile or next middleware
const requireCas: RequestHandler = (req, res, next) => {
  // eslint-disable-next-line prefer-arrow-callback
  passport.authenticate('cas', { session: false }, function (err, user, info) {
    // Return any existing errors
    if (err) { return next(err); }

    // If no profile obtained from CAS, return appropriate error message
    if (!user) { return res.status(401).json({ message: info?.message || 'Error in CAS authentication' }); }

    req.user = user;

    return next();
  })(req, res, next);
};

export default requireCas;
