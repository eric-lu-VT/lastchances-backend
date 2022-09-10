import supertest from 'supertest';
import dartRouter from 'routers/dart_router';
import { dartService } from 'services';
import db from '../../db/db';

const request = supertest(dartRouter);

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

const dartData = {
  netid: 'f0056mr',
  name: 'Eric Jiazhi Lu',
  first_name: 'Eric',
  last_name: 'Lu',
  middle_name: 'Jiazhi',
  email: 'Eric.J.Lu.25@Dartmouth.edu',
  prefix: null,
  suffix: null,
  campus_address: 'Hinman Box 2822',
  cache_date: '2022-09-09T21:15:45Z',
};

describe('Working auth router', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      throw new Error('Unable to connect to database...');
    }
  });

  describe('GET /searchName?first_name&middle_name&last_name', () => {
    it('Can get exact user', async () => {
      const getSpy = jest.spyOn(dartService, 'getDartUsers');
      const res = await request.get(`/searchName?first_name=${dartData.first_name}&middle_name=${dartData.middle_name}&last_name=${dartData.last_name}`);
      const userInfo = res.body[0];

      expect(res.status).toBe(200);
      Object.keys(dartData).forEach((key) => {
        if (key !== 'prefix' && key !== 'suffix' && key !== 'cache_date') {
          expect(userInfo[key]).toBe(dartData[key]);
        }
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });
});
