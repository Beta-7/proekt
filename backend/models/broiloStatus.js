const Sequelize = require('sequelize');
const db = require("../db.js");

const Firma = require("./firma")

const BroiloStatus = db.define('broilostatus',{
    brojMernaTocka:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    mesec:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    tarifa:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    datumPocetok:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    datumKraj:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    pocetnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false,
    },
    krajnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false,
    },
    kolicina:{
        type:Sequelize.FLOAT,
        allowNull: false,
    },
    multiplikator:{
        type:Sequelize.FLOAT,
        allowNull: false,
    },
    vkupnoKolicina:{
        type:Sequelize.FLOAT,
        allowNull: false,
    },
    nebitno:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    brojMernoMesto:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    brojBroilo:{
        type:Sequelize.STRING,
        allowNull: false,
    },

    datumOdEvn:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    
    
    
    
    
})

Firma.hasMany(BroiloStatus, {as: "Broilo"})
BroiloStatus.belongsTo(Firma)

module.exports = BroiloStatus;