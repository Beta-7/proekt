const Sequelize = require('sequelize');
const db = require("../db.js");


const Firma = db.define('firma',{
    name:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    broj:{
        type:Sequelize.STRING,
        allowNull: false,
            
    },
    adresaNaFirma:{
        type:Sequelize.STRING,
        allowNull: false
    },
    agent:{
        type:Sequelize.STRING,
        allowNull: false
    },
    nagrada:{
        type:Sequelize.DOUBLE,
        allowNull: false
    }
})


module.exports = Firma;