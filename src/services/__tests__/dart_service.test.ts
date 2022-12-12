import dotenv from 'dotenv';
import { dartService } from 'services';

dotenv.config();

const dartDataA = {
  netid: 'f0056mr',
  name: 'Eric Jiazhi Lu',
  first_name: 'Eric',
  last_name: 'Lu',
  middle_name: 'Jiazhi',
  email: 'Eric.J.Lu.25@dartmouth.edu',
  prefix: null,
  suffix: null,
  campus_address: 'Hinman Box 2822',
  cache_date: '2022-09-09T21:15:45Z',
};

let jwt = '';

describe('dartService', () => {
  describe('getDartJWT', () => {
    it('Can get Dart JWT', async () => {
      jwt = await dartService.getDartJWT();
      expect(jwt).toBeDefined();
    });
  });
  
  describe('getDartUsers', () => {
    it('Can get exact user', async () => {
      const user = await dartService.getDartUsers({ first_name: 'Eric', middle_name: 'Jiazhi', last_name: 'Lu', jwt }).then((res) => res[0]);

      expect(user.netid).toBe(dartDataA.netid);
      expect(user.name).toBe(dartDataA.name);
      expect(user.first_name).toBe(dartDataA.first_name);
      expect(user.last_name).toBe(dartDataA.last_name);
      expect(user.middle_name).toBe(dartDataA.middle_name);
      expect(user.email).toBe(dartDataA.email);
      expect(user.campus_address).toBe(dartDataA.campus_address);
    });
  });

  describe('getDartUserFromNetId', () => {
    it('Can get exact email', async () => {
      const user = await dartService.getDartUserFromNetId({ netid: 'f0056mr', jwt });
      expect(user.netid).toBe(dartDataA.netid);
      expect(user.name).toBe(dartDataA.name);
      expect(user.first_name).toBe(dartDataA.first_name);
      expect(user.last_name).toBe(dartDataA.last_name);
      expect(user.middle_name).toBe(dartDataA.middle_name);
      expect(user.email).toBe(dartDataA.email);
      expect(user.campus_address).toBe(dartDataA.campus_address);
    });

    it('Rejects bad email', async () => {
      expect(dartService.getDartUserFromNetId({ netid: 'abcde', jwt })).rejects.toBeDefined();
    });
  });
});

