import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireSelf from 'auth/requireSelf';
import { UserScopes } from 'db/models/user'; 
import { followingController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateFollowingSchema } from 'validation/following';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

// find and return all resources
router.route('/')
  .post(
    requireScope(UserScopes.User),
    validator.body(CreateFollowingSchema),
    followingController.createFollowing,
  );

router.route('/matches/:id')
  .get(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    followingController.getMatches,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
