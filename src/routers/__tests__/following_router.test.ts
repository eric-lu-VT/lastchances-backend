import supertest from 'supertest';
import followingRouter from 'routers/following_router';
import { followingService } from 'services';
import db from '../../db/db';
import { IFollowing } from '../../db/models/following';
// import { IUser } from 'db/models/user';

const request = supertest(followingRouter);

const followingData: Omit<IFollowing, 'id'> = {
  followedName: 'test test test',
  followedEmail: 'test@gmail.com',
  followerId: '68b0d858-9e75-49b0-902e-2b587bd9a996',
};

let validId = '';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

describe('Working following router', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      throw new Error('Unable to connect to database...');
    }
  });

  afterAll(async () => {
    try {
      await followingService.deleteFollowings({ id: validId });
    } catch (error) {
      throw new Error('Unable to clean up...');
    }
  });

  describe('POST /', () => {
    it('requires valid permissions', async () => {
      const createSpy = jest.spyOn(followingService, 'createFollowing');

      const res = await request
        .post('/')
        .send(followingData);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    /*
    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(followingService, 'createFollowing');

      const attempts = Object.keys(followingData).map(async (key) => {
        const resource = { ...followingData };
        delete resource[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(resource);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(followingService, 'createFollowing');

      const attempts = Object.keys(followingData).map(async (key) => {
        const resource = { ...followingData };
        resource[key] = typeof resource[key] === 'number'
          ? 'some string'
          : 0;

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(resource);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });
    */

    it('creates following when body is valid', async () => {
      const createSpy = jest.spyOn(followingService, 'createFollowing');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(followingData);
        
      expect(res.status).toBe(201);
      Object.keys(followingData).forEach((key) => {
        expect(res.body[key]).toBe(followingData[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  // This uses data from the seeder
  describe('GET /matches/:id', () => {
    // TODO: rejects unauthenticated user
    
    it('Matches correctly', async () => {
      const getSpy = jest.spyOn(followingService, 'getMatches');
      const res = await request
        .get('/matches/57aba4de-e449-433f-9ef9-9fdec62f8a2d')
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });
});
