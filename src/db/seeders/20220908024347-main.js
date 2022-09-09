'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * User Data
       */
      const users = [
        {
          id: 'a05742a3-0b8c-4fc4-98a3-640e55d8f2ab',
          email: 'unverified@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
          name: 'Unverified',
          role: 'UNVERIFIED',
        },
        {
          id: '68b0d858-9e75-49b0-902e-2b587bd9a996',
          email: 'user@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
          name: 'User',
          role: 'USER',
        },
        {
          id: '62da2543-bf07-4b1a-9d45-a531493d37d9',
          email: 'admin@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
          name: 'Admin',
          role: 'ADMIN',
        },
        {
          id: '57aba4de-e449-433f-9ef9-9fdec62f8a2d',
          email: 'A@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
          name: 'A',
          role: 'USER',
        },
        {
          id: 'f6daa916-996f-4b07-8ef4-8a2c935d9279',
          email: 'B@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
          name: 'B',
          role: 'USER',
        },
        {
          id: '96cc3b1b-e25b-4b21-a347-3984bb37f399',
          email: 'C@gmail.com',
          password: '$2b$10$bTbzneLBO3lY.9DvfXOUEeM/B0P.4RJMwHst8eTAqV90zllhKyEsm', // 12345
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
          followedEmail: 'A@gmail.com',
          followerId: 'f6daa916-996f-4b07-8ef4-8a2c935d9279', // B 
        },
        {
          id: '05a5ab10-5ca0-426e-8091-c0800c26215b',
          followedEmail: 'B@gmail.com',
          followerId: '57aba4de-e449-433f-9ef9-9fdec62f8a2d', // A
        },
        {
          id: '575e8b36-9cb6-4098-9620-cd0ba1c3e585',
          followedEmail: 'A@gmail.com',
          followerId: '96cc3b1b-e25b-4b21-a347-3984bb37f399', // C
        },
        {
          id: '909dee79-ac3f-49ff-9182-441b06de6a86',
          followedEmail: 'C@gmail.com',
          followerId: '57aba4de-e449-433f-9ef9-9fdec62f8a2d', // B
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
  async down(queryInterface, Sequelize) {
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