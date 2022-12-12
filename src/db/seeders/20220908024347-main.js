'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * User Data
       */
      const users = [
        {
          id: '68b0d858-9e75-49b0-902e-2b587bd9a996',
          netid: 'F0000VV',
          email: 'user@gmail.com',
          name: 'User',
          role: 'USER',
        },
        {
          id: '62da2543-bf07-4b1a-9d45-a531493d37d9',
          netid: 'F0000WW',
          email: 'admin@gmail.com',
          name: 'Admin',
          role: 'ADMIN',
        },
        {
          id: '57aba4de-e449-433f-9ef9-9fdec62f8a2d',
          netid: 'F0000AA',
          email: 'A@gmail.com',
          name: 'A',
          role: 'USER',
        },
        {
          id: 'f6daa916-996f-4b07-8ef4-8a2c935d9279',
          netid: 'F0000BB',
          email: 'B@gmail.com',
          name: 'B',
          role: 'USER',
        },
        {
          id: '96cc3b1b-e25b-4b21-a347-3984bb37f399',
          netid: 'F0000CC',
          email: 'C@gmail.com',
          name: 'C',
          role: 'USER',
        },
      ];
      await queryInterface.bulkInsert(
        'users',
        users.map((user) => ({
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction },
      );
  
      /**
       * Following Data
       */
      const followings = [
        {
          id: '5c0e8d61-9fc0-4803-ab48-cf1b8168b764',
          followedName: 'A',
          followedNetId: 'F0000AA',
          followerNetId: 'F0000BB',
          followerUserId: 'f6daa916-996f-4b07-8ef4-8a2c935d9279', // B 
        },
        {
          id: '05a5ab10-5ca0-426e-8091-c0800c26215b',
          followedName: 'B',
          followedNetId: 'F0000BB',
          followerNetId: 'F0000AA',
          followerUserId: '57aba4de-e449-433f-9ef9-9fdec62f8a2d', // A
        },
        {
          id: '575e8b36-9cb6-4098-9620-cd0ba1c3e585',
          followedName: 'A',
          followedNetId: 'F0000AA',
          followerNetId: 'F0000CC',
          followerUserId: '96cc3b1b-e25b-4b21-a347-3984bb37f399', // C
        },
        {
          id: '909dee79-ac3f-49ff-9182-441b06de6a86',
          followedName: 'C',
          followedNetId: 'F0000CC',
          followerNetId: 'F0000AA',
          followerUserId: '57aba4de-e449-433f-9ef9-9fdec62f8a2d', // A
        },
      ];
      await queryInterface.bulkInsert(
        'following',
        followings.map((resource) => ({
          ...resource,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction },
      );
  
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, { transaction });
      await queryInterface.bulkDelete('following', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};