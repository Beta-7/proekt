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
    vkupnoKolicina:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    brojNaBroilo:{
        type:Sequelize.STRING,
        allowNull: false
    },
    firmaid:{
        type:Sequelize.INTEGER
    }
})
Faktura.hasMany(StornoDisplay, {as: "StornoDisplay"})
StornoDisplay.belongsTo(Faktura)

module.exports = StornoDisplay;