import { Op } from 'sequelize';
import supertest from 'supertest';
import authRouter from 'routers/auth_router';
// import { userService } from 'services';
import db from '../../db/db';
import UserModel, { IUser } from '../../db/models/user';

const request = supertest(authRouter);

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

const mockUser: Omit<IUser, 'id' | 'role' | 'name'> = {
  netid: 'f0056mr',
  email: 'eric.j.lu.25@dartmouth.edu',
};

// let userId  = '';
// let code = '';

// TODO: This entire test case here still needs to be fixed

describe('Working auth router', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      throw new Error('Unable to connect to database...');
    }
  });

  afterAll(async () => {
    // Cleanup
    try {
      await UserModel.destroy({
        where: { netid: { [Op.eq]: mockUser.netid } },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error while cleaning verifiation code service tests...');
    }
  });

  describe('POST /logout', () => {
    it('logs out', async () => {
      const res = await request.post('/logout');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /jwt-signin', () => {
    it('requires jwt token', async () => {
      const res = await request.get('/jwt-signin');
      expect(res.status).toBe(401);
    });

    it('sends user JSON corresponding to jwt', async () => {
      const res = await request
        .get('/jwt-signin')
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(mockUser)
        .filter((key) => key !== 'password')
        .forEach((key) => {
          expect(res.body.user[key]).toBe(mockUser[key]);
        });
    });
  });
});

// TODO: Test Nodemailer w/ Jest
