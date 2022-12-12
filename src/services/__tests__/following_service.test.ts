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
        netid: 'Z00001',
        name: '1',
        role: UserScopes.User,
      };
      userDataA = await userService.createUser(tp1);

      const tp2 : Omit<IUser, 'id'> = {
        email: '2@gmail.com',
        netid: 'Z00002',
        name: '2',
        role: UserScopes.User,
      };
      userDataB = await userService.createUser(tp2);
      
      followingDataA = {
        followedName: userDataB.name,
        followedNetId: userDataB.netid,
        followerNetId: userDataA.netid,
        followerUserId: userDataA.id,
      };
      followingDataB = {
        followedName: userDataA.name,
        followedNetId: userDataA.netid,
        followerNetId: userDataB.netid,
        followerUserId: userDataB.id,
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
      const following: IFollowing = await followingService.createFollowing(followingDataA);

      expect(following.id).toBeDefined();
      expect(following.followedNetId).toBe(followingDataA.followedNetId);
      expect(following.followerNetId).toBe(followingDataA.followerNetId);
      expect(following.followerUserId).toBe(followingDataA.followerUserId);
      idFollowingA = String(following.id);
    });

    it('Can create following B', async () => {
      const following: IFollowing = await followingService.createFollowing(followingDataB);

      expect(following.id).toBeDefined();
      expect(following.followedNetId).toBe(followingDataB.followedNetId);
      expect(following.followerNetId).toBe(followingDataB.followerNetId);
      expect(following.followerUserId).toBe(followingDataB.followerUserId);
      idFollowingB = String(following.id);
    });
  });

  describe('getFollowings', () => {
    it('Can get followings - id', async () => {
      const following: IFollowing = await followingService.getFollowings({ id: idFollowingA }).then((res) => res[0]);

      expect(following.followedNetId).toBe(followingDataA.followedNetId);
      expect(following.followerNetId).toBe(followingDataA.followerNetId);
      expect(following.followerUserId).toBe(followingDataA.followerUserId);
    });

    it('Returns empty array if no followings to get', async () => {
      expect(await followingService.getFollowings({ id: invalidId })).toStrictEqual([]);
    });

    it('Gets all followings when no filter passed in', async () => {
      const followings: IFollowing[] = await followingService.getFollowings({});
      expect(followings.length).toBe(6);
    });
  });

  // Really there shouldn't be any edits to entries - should just be deleted
  describe('updateFollowings', () => {
    it('Updates following field, returns updated following', async () => {
      const newFollowedNetId = 'Z00003';

      const updatedFollowing: IFollowing = await followingService.updateFollowings({ followedNetId: newFollowedNetId }, { id: idFollowingA }).then((res) => res[0]);
      expect(updatedFollowing.followedNetId).toBe(newFollowedNetId);
    });

    it('Returns empty array if no followings to edit', async () => {
      expect(await followingService.updateFollowings({ id: invalidId }, { followedNetId: '10000' })).toStrictEqual([]);
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
