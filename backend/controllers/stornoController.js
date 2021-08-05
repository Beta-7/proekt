const Storno = require("../models/storno")
const csv=require("csvtojson");
const _ = require('lodash');
const Broilos = require("../models/broiloStatus");
const MernaTocka = require("../models/mernaTocka");
const Faktura = require("../models/faktura");

const uploadStornoFile = async (req,res)=>{
   new Promise((reject, success)=>{
    csv({
        noheader: true,
        headers: ['bronNaMernaTocka','mesecNaFakturiranje','tarifa','datumNaPocetokNaMerenje','datumNaZavrshuvanjeNaMerenje','pocetnaSostojba','krajnaSostojba','kolicina','multiplikator','vkupnoKolicina','nebitno','brojNaMernoMesto','brojNaBroilo','nebitno2','datumNaIzrabotkaEVN'],
        delimiter: ";"
    })
    .fromString(req.files.stornoData.data.toString('utf8'))
    .then((jsonObj)=>{

        for( var red in jsonObj){ 
            
            console.log(red)
            MernaTocka.findOne({where:{tockaID:jsonObj[red].bronNaMernaTocka}}).then((mernatocka)=>{
                Faktura.findOne({where:{
                    firmaId:mernatocka.dataValues.firmaId
                },
                order: [
                    ['id', 'DESC'],
                ],
                
            }).then((faktura)=>{
                Storno.create({
                    bronNaMernaTocka: jsonObj[red].bronNaMernaTocka,
                    mesecNaFakturiranje: jsonObj[red].mesecNaFakturiranje,
                    tarifa: jsonObj[red].tarifa,
                    datumNaPocetokNaMerenje: jsonObj[red].datumNaPocetokNaMerenje,
                    datumNaZavrshuvanjeNaMerenje: jsonObj[red].datumNaZavrshuvanjeNaMerenje,
                    pocetnaSostojba: parseFloat(jsonObj[red].pocetnaSostojba.replace(",",".")),
                    krajnaSostojba: parseFloat(jsonObj[red].krajnaSostojba.replace(",",".")),
                    kolicina: parseFloat(jsonObj[red].kolicina.replace(",",".")),
                    multiplikator: parseFloat(jsonObj[red].multiplikator),
                    vkupnoKolicina: parseFloat(jsonObj[red].vkupnoKolicina),
                    nebitno: jsonObj[red].nebitno,
                    brojNaMernoMesto: jsonObj[red].brojNaMernoMesto,
                    brojNaBroilo: jsonObj[red].brojNaBroilo,
                    nebitno2: jsonObj[red].nebitno2,
                    datumNaIzrabotkaEVN: jsonObj[red].datumNaIzrabotkaEVN,
                    fakturaId: faktura.id
                 })
                })
            })


            

        }
    })
    
    
    return res.json({"message":"success","detail":"uploaded storno file"})
})     
    }











module.exports={uploadStornoFile}