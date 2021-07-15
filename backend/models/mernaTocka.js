const Sequelize = require('sequelize');
const db = require("../db.js");

const Firma = require("./firma")

const MernaTocka = db.define('mernaTocka',{
    tockaID:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    cena:{
        type:Sequelize.FLOAT,
        allowNull: false,
            
    }
})

Firma.hasMany(MernaTocka, {as: "mernitocki"})
MernaTocka.belongsTo(Firma)

module.exports = MernaTocka;