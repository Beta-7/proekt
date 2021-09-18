const Sequelize = require('sequelize');
const db = require("../db.js");

const Firma = require("./firma")

const MernaTocka = db.define('mernaTocka',{
    tockaID:{
        type:Sequelize.STRING,
        allowNull: false
    },
    cena:{
        type:Sequelize.FLOAT
    },
    cenaVT:{
        type:Sequelize.FLOAT,
    },
    cenaNT:{
        type:Sequelize.FLOAT,
    },
    adresa:{
        type:Sequelize.STRING,
    },
    brojMestoPotrosuvacka:{
        type:Sequelize.STRING,
    },
    tarifa:{
        type:Sequelize.STRING,

    },
})

Firma.hasMany(MernaTocka, {as: "mernitocki"})
MernaTocka.belongsTo(Firma)

module.exports = MernaTocka;