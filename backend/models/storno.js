const Sequelize = require('sequelize');
const db = require("../db.js");
const Firma = require('./firma.js');


const Storno = db.define('storno',{
    brojNaMernaTocka:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    mesecNaFakturiranje:{
        type:Sequelize.STRING,
        allowNull: false,
            
    },
    tarifa:{
        type:Sequelize.STRING,
        allowNull: false
    },
    datumNaPocetokNaMerenje:{
        type:Sequelize.STRING,
        allowNull: false
    },
    datumNaZavrshuvanjeNaMerenje:{
        type:Sequelize.STRING,
        allowNull: false
    },
    pocetnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    krajnaSostojba:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    kolicina:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    multiplikator:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    vkupnoKolicina:{
        type:Sequelize.FLOAT,
        allowNull: false
    },
    nebitno:{
        type:Sequelize.STRING,
        allowNull: false
    },
    brojNaMernoMesto:{
        type:Sequelize.STRING,
        allowNull: false
    },
    brojNaBroilo:{
        type:Sequelize.STRING,
        allowNull: false
    },
    nebitno2:{
        type:Sequelize.STRING,
        allowNull: false
    },
    datumNaIzrabotkaEVN:{
        type:Sequelize.STRING,
        allowNull: false
    },
    pomireno:{
        type:Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})
Firma.hasMany(Storno, {as: "storni"})
Storno.belongsTo(Firma)

module.exports = Storno;