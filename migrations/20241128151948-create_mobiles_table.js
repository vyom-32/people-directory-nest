module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mobiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      personId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Persons',
          key: 'id'
        }
      },
      mobileType: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
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
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Mobiles');
  }
};