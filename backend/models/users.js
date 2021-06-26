const Sequelize = require('sequelize');
const db = require("../db.js");


const User = db.define('users',{
    username:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
            
    },
    ime:{
        type:Sequelize.STRING
    },
    prezime:{
        type:Sequelize.STRING
    },
    isAdmin:{
        type:Sequelize.BOOLEAN
    }
})


module.exports = User;