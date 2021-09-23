const Storno = require("../models/storno")
const csv=require("csvtojson");
const _ = require('lodash');
const Faktura = require("../models/faktura");
const Firma = require("../models/firma")
const Broilos = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const generateLog = require("../logs");
const { removeListener } = require("../routes/fakturaRoutes");
const db = require('../db.js')  
const { QueryTypes } = require('sequelize');


const dodadiStorno = async (req, res) => {
    const brojNaMernaTocka=req.body.brojNaMernaTocka;
    const mesecNaFakturiranje=req.body.mesecNaFakturiranje;
    const tarifa=req.body.tarifa;
    const datumNaPocetokNaMerenje=req.body.datumNaPocetokNaMerenje;
    const datumNaZavrshuvanjeNaMerenje=req.body.datumNaZavrshuvanjeNaMerenje;
    const pocetnaSostojba=parseFloat(req.body.pocetnaSostojba);
    const krajnaSostojba=parseFloat(req.body.krajnaSostojba);
    const kolicina=parseFloat(req.body.kolicina);
    const multiplikator=parseFloat(req.body.multiplikator);
    const vkupnoKolicina=parseFloat(req.body.vkupnoKolicina);
    const nebitno="/";
    const brojNaMernoMesto=req.body.brojNaMernoMesto;
    const brojNaBroilo=req.body.brojNaBroilo;
    const nebitno2="/";
    const datumNaIzrabotkaEVN=req.body.datumNaIzrabotkaEVN;
    const pomireno=req.body.pomireno;


    if(brojNaMernaTocka==null || mesecNaFakturiranje==null || tarifa==null || datumNaPocetokNaMerenje==null || datumNaZavrshuvanjeNaMerenje==null || pocetnaSostojba==null || krajnaSostojba==null || kolicina==null || multiplikator==null || vkupnoKolicina==null || brojNaMernoMesto==null || brojNaBroilo==null || datumNaIzrabotkaEVN==null){
        return res.send({"message":"error","detail":"missing arguments"})
    }


    let created = await Storno.create({
        brojNaMernaTocka,
        mesecNaFakturiranje,
        tarifa,
        datumNaPocetokNaMerenje,
        datumNaZavrshuvanjeNaMerenje,
        pocetnaSostojba,
        krajnaSostojba,
        kolicina,
        multiplikator,
        vkupnoKolicina,
        nebitno,
        brojNaMernoMesto,
        brojNaBroilo,
        nebitno2,
        datumNaIzrabotkaEVN,
        pomireno,
        })
        generateLog("Додаде нов сторно ред",req.session.username, req.body.username)
        updateID(created)
        return res.send({"message":"success","detail":"Successfully added storno"})

}
const promeniStorno = (req,res) =>{
    
    var storno = Storno.findOne({where:{id:req.body.id}});
    Storno.findOne({where:{id:req.body.id}}).then((id)=>{
        if(id===null){
           return res.json({message:"No Storno",detail:"No Storno with that id"})
        }

        const brojNaMernaTocka=req.body.brojNaMernaTocka;
        const mesecNaFakturiranje=req.body.mesecNaFakturiranje;
        const tarifa=req.body.tarifa;
        const datumNaPocetokNaMerenje=req.body.datumNaPocetokNaMerenje;
        const datumNaZavrshuvanjeNaMerenje=req.body.datumNaZavrshuvanjeNaMerenje;
        const pocetnaSostojba=parseFloat(req.body.pocetnaSostojba);
        const krajnaSostojba=parseFloat(req.body.krajnaSostojba);
        const kolicina=parseFloat(req.body.kolicina);
        const multiplikator=parseFloat(req.body.multiplikator);
        const vkupnoKolicina=parseFloat(req.body.vkupnoKolicina);
        const nebitno="/";
        const brojNaMernoMesto=req.body.brojNaMernoMesto;
        const brojNaBroilo=req.body.brojNaBroilo;
        const nebitno2="/";
        const datumNaIzrabotkaEVN=req.body.datumNaIzrabotkaEVN;
        const pomireno=req.body.pomireno;


        if(brojNaMernaTocka==null || mesecNaFakturiranje==null || tarifa==null || datumNaPocetokNaMerenje==null || datumNaZavrshuvanjeNaMerenje==null || pocetnaSostojba==null || krajnaSostojba==null || kolicina==null || multiplikator==null || vkupnoKolicina==null || brojNaMernoMesto==null || brojNaBroilo==null || datumNaIzrabotkaEVN==null){
            return res.send({"message":"error","detail":"missing arguments"})
        }

        storno.brojNaMernaTocka=brojNaMernaTocka;
        storno.mesecNaFakturiranje=mesecNaFakturiranje;
        storno.tarifa=tarifa;
        storno.datumNaPocetokNaMerenje=datumNaPocetokNaMerenje;
        storno.datumNaZavrshuvanjeNaMerenje=datumNaZavrshuvanjeNaMerenje;
        storno.pocetnaSostojba=pocetnaSostojba;
        storno.krajnaSostojba=krajnaSostojba;
        storno.kolicina=kolicina;
        storno.multiplikator=multiplikator;
        storno.vkupnoKolicina=vkupnoKolicina;
        storno.nebitno=nebitno;
        storno.brojNaMernoMesto=brojNaMernoMesto;
        storno.brojNaBroilo=brojNaBroilo;
        storno.nebitno2=nebitno2;
        storno.datumNaIzrabotkaEVN=datumNaIzrabotkaEVN;
        storno.pomireno=pomireno;
    Storno.update(storno, {
        where:{id:req.body.id}
    }).then(()=>{
        generateLog("Промени веќе постоечко сторно",req.session.username, req.body.username)
        return res.json({message:"Success",detail:"Updated Storno"})
        
    })
    })
    

}
const izbrisiStorno = async (req,res) =>{
    const storno = await Storno.findOne({where:{id:req.body.id}})
    Storno.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
        generateLog("Избриша сторно",req.session.username, user.username)
        return res.json({message:"Success",detail:"Deleted Storno"})
    }).catch(()=>{
        return res.json({message:"Error",detail:"Failed to delete Storno"})
    })
}



const getStornos= async function(req,res){
    let stornos
    let order
    let order1 = [["id", "desc"]]
    if(req.body.orderDirection!='desc' || req.body.orderDirection!='asc'){
        order = [[req.body.sortField, req.body.orderDirection]]
    }
    stornos = await db.query("SELECT * FROM stornos WHERE \"brojNaMernaTocka\" LIKE '%"+req.body.search+
                                "%' OR \"mesecNaFakturiranje\" LIKE '%"+req.body.search+
                                "%' OR \"tarifa\" LIKE '%3"+req.body.search+
                                "%' OR \"datumNaPocetokNaMerenje\" LIKE '%"+req.body.search+
                                "%' OR \"datumNaZavrshuvanjeNaMerenje\" LIKE '%"+req.body.search+
                                "%' OR \"pocetnaSostojba\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"krajnaSostojba\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"kolicina\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"multiplikator\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"vkupnoKolicina\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"brojNaMernoMesto\" LIKE '%"+req.body.search+
                                "%' OR \"brojNaBroilo\" LIKE '%"+req.body.search+
                                "%' OR \"datumNaIzrabotkaEVN\" LIKE '%"+req.body.search+
                                "%' ORDER BY \""+((order[0][0] === undefined) ? order1[0][0] : order[0][0])+
                                "\" "+((order[0][1] == undefined) ? order1[0][1] : order[0][1])+
                                " LIMIT "+((req.body.pageSize == undefined) ? 20 : req.body.pageSize)+
                                " OFFSET "+(isNaN((req.body.pageSize*(req.body.page))) ? 0 : (req.body.pageSize*(req.body.page))), 
                                { type: QueryTypes.SELECT });

    return res.json({
        count: stornos.length,
        rows: stornos
    })
}

const reasociate = async(req,res)=>{
    Storno.findAll().then((res)=>{
        res.map((storno)=>{
            MernaTocka.findOne({where:{tockaID:storno.brojNaMernaTocka}}).then((mernatocka)=>{
                if(mernatocka!==null){
                    Storno.update({firmaId:mernatocka.firmaId},{where:{id:storno.id}})
                }
            })

        })
    })
    return res.json({"message":"success","detail":"reasociated"})
}

const updateID = async (created)=>{
    MernaTocka.findOne({where:{
        tockaID:created.brojNaMernaTocka
    }}).then((res)=>{
        //(res)
        if(res===null){
            MernaTocka.create({
                tockaID:created.brojNaMernaTocka,
                cenaVT:0,
                cenaNT:0
            }).then(()=>{
                generateLog("Генерирана мерна точка од сторно фајл",actedon=created.brojNaMernaTocka)
                return
            })
        }
        else{        
            if(res.dataValues.firmaId!==null){

                
            Firma.findOne({order: [ [ 'id', 'DESC' ]],
            where:{
                id:res.dataValues.firmaId
            }}).then((resu)=>{
                created.update({
                    firmaId:resu.dataValues.id
                })
            })
        }
    }
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
                vkupnoKolicina: parseFloat(jsonObj[red].vkupnoKolicina.replace(",",".")),
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











module.exports={uploadStornoFile, getStornos, dodadiStorno, promeniStorno, izbrisiStorno, reasociate}