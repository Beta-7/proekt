const Sequelize = require('sequelize');
const db = require("../db.js");


const Nagradi = db.define('nagradi',{
    agent:{
        type:Sequelize.STRING,
        allowNull: false
    },
    suma:{
        type:Sequelize.DOUBLE,
    },
    mesec:{
        type:Sequelize.INTEGER
    },
    godina:{
        type:Sequelize.INTEGER
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