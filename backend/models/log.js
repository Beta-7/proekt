const Sequelize = require('sequelize');
const db = require("../db.js");

const Log = db.define('logs',{
    message:{
        type:Sequelize.STRING
    },
    actor:{
        type:Sequelize.STRING
    },
    actedon:{
        type:Sequelize.STRING
    }
})

module.exports = Log