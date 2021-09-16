const Sequelize = require('sequelize');
const db = require("../db.js");


const Kamata = db.define('kamata',{
    firmaid:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    fakturaStoKasniId:{
        type:Sequelize.INTEGER
    },
    arhivskiBroj:{
        type:Sequelize.STRING
    },
    fakturaDisplayId:{
        type:Sequelize.INTEGER
    },
    suma:{
        type:Sequelize.FLOAT,
            
    },
    rok:{
        type:Sequelize.STRING,
    },
    platenoData:{
        type:Sequelize.STRING
    }
})


module.exports = Kamata;