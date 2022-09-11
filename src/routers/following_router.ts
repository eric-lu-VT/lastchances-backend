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

router.route('/:id')
  .post(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    validator.body(CreateFollowingSchema),
    followingController.createFollowing,
  )
  .get(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    followingController.getFollowings,
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
