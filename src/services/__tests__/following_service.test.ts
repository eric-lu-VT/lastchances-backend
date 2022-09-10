import { followingService } from 'services';
import db from '../../db/db';
import { IFollowing } from '../../db/models/following';
import { IUser, UserScopes } from 'db/models/user';
import { userService } from 'services';
import dotenv from 'dotenv';

dotenv.config();

let userDataA: IUser;
let userDataB: IUser;

let idFollowingA = '';
let idFollowingB = '';
const invalidId = '3fe847d8-2074-4ed7-a51c-e10fb1053c9e';
let followingDataA: Omit<IFollowing, 'id'>; // 2 follow 1
let followingDataB: Omit<IFollowing, 'id'>; // 1 follow 2

describe('followingService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
      const tp1 : Omit<IUser, 'id'> = {
        email: '1@gmail.com',
        password: '12345',
        name: '1',
        role: UserScopes.User,
      };
      userDataA = await userService.createUser(tp1);

      const tp2 : Omit<IUser, 'id'> = {
        email: '2@gmail.com',
        password: '12345',
        name: '2',
        role: UserScopes.User,
      };
      userDataB = await userService.createUser(tp2);
      
      followingDataA = {
        followedName: userDataB.name,
        followedEmail: userDataB.email,
        followerId: userDataA.id,
      };
      followingDataB = {
        followedName: userDataA.name,
        followedEmail: userDataA.email,
        followerId: userDataB.id,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });

  afterAll(async () => {
    try {
      await userService.deleteUsers({ id: userDataA.id });
    } catch (error) {
      throw new Error('Unable to clean up...');
    }
  });

  describe('createFollowing', () => {
    it('Can create following A', async () => {
      const resource: IFollowing = await followingService.createFollowing(followingDataA);

      expect(resource.id).toBeDefined();
      expect(resource.followedEmail).toBe(followingDataA.followedEmail);
      expect(resource.followerId).toBe(followingDataA.followerId);
      idFollowingA = String(resource.id);
    });

    it('Can create following B', async () => {
      const resource: IFollowing = await followingService.createFollowing(followingDataB);

      expect(resource.id).toBeDefined();
      expect(resource.followedEmail).toBe(followingDataB.followedEmail);
      expect(resource.followerId).toBe(followingDataB.followerId);
      idFollowingB = String(resource.id);
    });
  });

  describe('getFollowings', () => {
    it('Can get followings - id', async () => {
      const resource: IFollowing = await followingService.getFollowings({ id: idFollowingA }).then((res) => res[0]);

      expect(resource.followedEmail).toBe(followingDataA.followedEmail);
      expect(resource.followerId).toBe(followingDataA.followerId);
    });

    it('Returns empty array if no followings to get', async () => {
      expect(await followingService.getFollowings({ id: invalidId })).toStrictEqual([]);
    });

    it('Gets all resources when no filter passed in', async () => {
      const resources: IFollowing[] = await followingService.getFollowings({});
      expect(resources.length).toBe(6);
    });

    /*
    it('Gets all resources that match filter', async () => {
      const resources = await followingService.getFollowings({ value: followingDataA.value });
      expect(resources.length).toBe(1);
    });
    */
  });

  // Really there shouldn't be any edits to entries - should just be deleted
  describe('updateFollowings', () => {
    it('Updates resource field, returns updated resource', async () => {
      const newFollowedEmail = '3@gmail.com';

      const updatedFollowing: IFollowing = await followingService.updateFollowings({ followedEmail: newFollowedEmail }, { id: idFollowingA }).then((res) => res[0]);
      expect(updatedFollowing.followedEmail).toBe(newFollowedEmail);
    });

    it('Returns empty array if no resources to edit', async () => {
      expect(await followingService.updateFollowings({ id: invalidId }, { followedEmail: '10000' })).toStrictEqual([]);
    });
  });

  // Really there shouldn't be any deletion of entries
  describe('deleteFollowings', () => {
    it('Deletes existing following', async () => {
      await followingService.deleteFollowings({ id: idFollowingA });
      expect(await followingService.getFollowings({ id: idFollowingA })).toStrictEqual([]);
    });

    it('Cascade deletes', async () => {
      await userService.deleteUsers({ id: userDataB.id });
      expect(await followingService.getFollowings({ id: idFollowingB })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no followings to delete', async () => {
      expect(await followingService.deleteFollowings({ id: invalidId })).toStrictEqual(0);
    });
  });

  // This uses data from the seeder
  describe('getMatches', () => {
    it('Matches correctly', async () => {
      const res = await followingService.getMatches({ id: '57aba4de-e449-433f-9ef9-9fdec62f8a2d' });
      expect(res.length).toBe(2);
    });
  });
});
