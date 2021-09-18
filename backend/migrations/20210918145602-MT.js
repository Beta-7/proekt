module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('mernaTockas', 'adresa', Sequelize.STRING, {after: "cena"}),
    queryInterface.addColumn('mernaTockas', 'brojMestoPotrosuvacka', Sequelize.STRING, {after: "cena"}),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('mernaTockas', 'adresa', Sequelize.STRING, {after: "cena"}),
    queryInterface.removeColumn('mernaTockas', 'brojMestoPotrosuvacka', Sequelize.STRING, {after: "cena"}),
  ])
};
