const Sequelize = require('sequelize');
const db = require("../db.js");

const Firma = require("./firma")
const BroiloStatus = require("./broiloStatus")

const Faktura = db.define('faktura',{
    brojNaFaktura:{
        type:Sequelize.STRING,
        allowNull: false
    },
    mesec:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    godina:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    platena:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    },
    dolg:{
        type:Sequelize.FLOAT
    },
    rokZaNaplata:{
        type:Sequelize.STRING
    },
    datumNaIzdavanje:{
        type:Sequelize.STRING
    },
    kamataZaKasnenje:{
        type:Sequelize.FLOAT
    },
    dataOd:{
        type:Sequelize.STRING
    },
    dataDo:{
        type:Sequelize.STRING
    },
    elektricnaEnergija:{
        type:Sequelize.FLOAT
    },
    cenaKwhBezDDV:{
        type:Sequelize.FLOAT
    },
    vkupenIznosBezDDV:{
        type:Sequelize.FLOAT
    },
    obnovlivaEnergija:{
        type:Sequelize.FLOAT
    },
    cenaObnovlivaEnergija:{
        type:Sequelize.FLOAT
    },
    vkupnaObnovlivaEnergijaBezDDV:{
        type:Sequelize.FLOAT
    },
    nadomestZaOrganizacija:{
        type:Sequelize.FLOAT
    },
    vkupenIznosNaFakturaBezDDV:{
        type:Sequelize.FLOAT
    },
    DDV:{
        type:Sequelize.FLOAT
    },
    vkupnaNaplata:{
        type:Sequelize.FLOAT
    },
    kamataOdPredhodno:{
        type:Sequelize.FLOAT
    }
})

Firma.hasMany(Faktura)
Faktura.belongsTo(Firma)

Faktura.hasMany(BroiloStatus, {as: "Broilo"})
BroiloStatus.belongsTo(Faktura)


module.exports = Faktura