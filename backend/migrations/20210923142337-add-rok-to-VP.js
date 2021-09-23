module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('vkupnopotrosenas', 'rok', Sequelize.INTEGER),
]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('vkupnopotrosenas', 'rok', Sequelize.STRING),
  ])
};
