const Sequelize = require('sequelize');

module.exports =  new Sequelize("postgres://postgres:admin@localhost:5432/proekt", {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});