const Sequelize = require('sequelize');
const db = require("../db.js");
const Faktura = require('./faktura.js');


const StornoDisplay = db.define('stornoDisplay',{
    tarifa:{
        type:Sequelize.STRING,
        allowNull: false
    },
    datumNaPocetokNaMerenje:{
        type:Sequelize.STRING,
        allowNull: false
    },
    datumNaZavrshuvanjeNaMerenje:{
        type:Sequelize.STRING,
        allowNull: false
    },
    pocetnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    krajnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    kolicina:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    multiplikator:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    vkupnoKolicina:{
        type:Sequelize.FLOAT
    },
    brojNaBroilo:{
        type:Sequelize.STRING,
        allowNull: false
    },
    firmaId:{
        type:Sequelize.INTEGER
    }
})
Faktura.hasMany(StornoDisplay, {as: "StornoDisplay"})
StornoDisplay.belongsTo(Faktura)

module.exports = StornoDisplay;