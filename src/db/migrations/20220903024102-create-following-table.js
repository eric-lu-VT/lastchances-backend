'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('following', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      followedName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      followedNetId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      followerNetId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      followerUserId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'cascade',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('following');
  },
};