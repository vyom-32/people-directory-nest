'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Persons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(30)
      },
      middleName: {
        type: Sequelize.STRING(30)
      },
      lastName: {
        type: Sequelize.STRING(30)
      },
      fullName: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.ENUM(
          'Male',
          'Female'
        ),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE Persons 
      MODIFY COLUMN fullName VARCHAR(100) 
      GENERATED ALWAYS AS (
        CONCAT(
          COALESCE(firstName, ''), 
          ' ', 
          COALESCE(middleName, ''), 
          ' ', 
          COALESCE(lastName, '')
        )
      ) STORED;
    `);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Persons');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
