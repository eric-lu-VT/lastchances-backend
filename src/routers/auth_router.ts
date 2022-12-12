import bodyParser from 'body-parser';
import express from 'express';
import requireLogout from 'auth/requireLogout';
import { requireAuth, requireCas } from 'auth';
import { authController } from 'controllers';
import { validationErrorHandler } from 'validation';
import { errorHandler } from 'errors';

const router = express();

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

router.route('/jwt-signin')
  .get(
    requireAuth, 
    authController.jwtSignIn,
  );

router.route('/cas-signin')
  .get(
    requireCas,
    authController.casSignIn,
  );

router.route('/logout')
  .post(
    requireLogout,
    (req, res) => {
      res.sendStatus(200);
    },
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
