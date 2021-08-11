const Storno = require("../models/storno")
const csv=require("csvtojson");
const _ = require('lodash');
const Faktura = require("../models/faktura");
const Firma = require("../models/firma")
const Broilos = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const generateLog = require("../logs")
const updateID = async (created)=>{
    MernaTocka.findOne({where:{
        tockaID:created.brojNaMernaTocka
    }}).then((res)=>{
        Firma.findOne({order: [ [ 'id', 'DESC' ]],
        where:{
            id:res.dataValues.firmaId
        }}).then((resu)=>{
            created.update({
                firmaId:resu.dataValues.id
            })
        })
    })
}
const uploadStornoFile = async (req,res)=>{
   new Promise((reject, success)=>{
    csv({
        noheader: true,
        headers: ['brojNaMernaTocka','mesecNaFakturiranje','tarifa','datumNaPocetokNaMerenje','datumNaZavrshuvanjeNaMerenje','pocetnaSostojba','krajnaSostojba','kolicina','multiplikator','vkupnoKolicina','nebitno','brojNaMernoMesto','brojNaBroilo','nebitno2','datumNaIzrabotkaEVN'],
        delimiter: ";"
    })
    .fromString(req.files.stornoData.data.toString('utf8'))
    .then((jsonObj)=>{

        for( var red in jsonObj){
            if(parseFloat(jsonObj[red].kolicina.replace(",","."))!=0){
            Storno.create({
                brojNaMernaTocka: jsonObj[red].brojNaMernaTocka,
                mesecNaFakturiranje: jsonObj[red].mesecNaFakturiranje,
                tarifa: jsonObj[red].tarifa,
                datumNaPocetokNaMerenje: jsonObj[red].datumNaPocetokNaMerenje,
                datumNaZavrshuvanjeNaMerenje: jsonObj[red].datumNaZavrshuvanjeNaMerenje,
                pocetnaSostojba: parseFloat(jsonObj[red].pocetnaSostojba.replace(",",".")),
                krajnaSostojba: parseFloat(jsonObj[red].krajnaSostojba.replace(",",".")),
                kolicina: parseFloat(jsonObj[red].kolicina.replace(",",".")),
                multiplikator: parseFloat(jsonObj[red].multiplikator.replace(",",".")),
                vkupnoKolicina: parseFloat(jsonObj[red].vkupnoKolicina.replace(",","."))*-1.0,
                nebitno: jsonObj[red].nebitno,
                brojNaMernoMesto: jsonObj[red].brojNaMernoMesto,
                brojNaBroilo: jsonObj[red].brojNaBroilo,
                nebitno2: jsonObj[red].nebitno2,
                datumNaIzrabotkaEVN: jsonObj[red].datumNaIzrabotkaEVN,
             }).then((created)=>{
                updateID(created)
             })
            }
        }
    })
    
    generateLog("prikaci storno fajl",req.session.username)
    return res.json({"message":"success","detail":"uploaded storno file"})
})     
    }











module.exports={uploadStornoFile}