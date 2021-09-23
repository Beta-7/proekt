const { FLOAT } = require('sequelize');
const Sequelize = require('sequelize');
const db = require("../db.js");


const VkupnoPotrosena = db.define('vkupnopotrosena',{
    mesec:{
        type:Sequelize.INTEGER,
        
    },
    godina:{
        type:Sequelize.INTEGER,
        
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
    },
    nadomestZaOrganizacija:{
        type:FLOAT
    },
    DDVProcent:{
        type:FLOAT
    },
    rok:{
        type:Sequelize.INTEGER,
        
    },
})


module.exports = VkupnoPotrosena;