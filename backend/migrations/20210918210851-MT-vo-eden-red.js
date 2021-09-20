module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('mernaTockas', 'cenaVT', Sequelize.FLOAT, {after: "cena"}),
    queryInterface.addColumn('mernaTockas', 'cenaNT', Sequelize.FLOAT, {after: "cena"}),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('mernaTockas', 'cenaVT', Sequelize.FLOAT, {after: "cena"}),
    queryInterface.removeColumn('mernaTockas', 'cenaNT', Sequelize.FLOAT, {after: "cena"}),
  ])
};
