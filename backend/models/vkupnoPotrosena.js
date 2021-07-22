const { FLOAT } = require('sequelize');
const Sequelize = require('sequelize');
const db = require("../db.js");


const VkupnoPotrosena = db.define('vkupnopotrosena',{
    mesec:{
        type:Sequelize.STRING,
        
    },
    godina:{
        type:Sequelize.STRING,
        
    },
    vkupnoPotrosena:{
        type:Sequelize.STRING,
            
    },
    zelenaKolicina:{
        type:Sequelize.FLOAT,
    
    },
    zelenaCena:{
        type:Sequelize.DOUBLE
    },
    kamatnaStapka:{
        type:FLOAT
    }
})


module.exports = VkupnoPotrosena;