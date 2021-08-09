const Sequelize = require('sequelize');
const db = require("./db.js");

const Log = db.define('logs',{
    message:{
        type:Sequelize.STRING
    },
    actor:{
        type:Sequelize.STRING
    }
})

const generateLog = (message, actor="SYSTEM") =>{
    Log.create({
        message,
        actor
    })
}

module.exports = generateLog