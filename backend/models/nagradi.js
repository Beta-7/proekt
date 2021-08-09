const Sequelize = require('sequelize');
const db = require("../db.js");
const Faktura = require("./faktura")
const User  = require("./users")

const Nagradi = db.define('nagradi',{
    agent:{
        type:Sequelize.STRING,
        allowNull: false
    },
    suma:{
        type:Sequelize.DOUBLE,
    },
    mesec:{
        type:Sequelize.STRING
    },
    godina:{
        type:Sequelize.STRING
    },
    firma:{
        type:Sequelize.STRING
    },
    pomireno:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    }
})



module.exports = Nagradi;