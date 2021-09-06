const Storno = require("../models/storno")
const csv=require("csvtojson");
const _ = require('lodash');
const Faktura = require("../models/faktura");
const Firma = require("../models/firma")
const Broilos = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const generateLog = require("../logs");
const { removeListener } = require("../routes/fakturaRoutes");



const dodadiStorno = (req, res) => {
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
    const nebitno=req.body.nebitno;
    const brojNaMernoMesto=req.body.brojNaMernoMesto;
    const brojNaBroilo=req.body.brojNaBroilo;
    const nebitno2=req.body.nebitno2;
    const datumNaIzrabotkaEVN=req.body.datumNaIzrabotkaEVN;
    const pomireno=req.body.pomireno;



    Storno.create({
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
        }).then(()=>{
            generateLog("Додаде нов сторно ред",req.session.username, req.body.username)
            updateID(created)
            return res.send({"message":"success","detail":"Successfully added storno"})}).catch(err=>{
              console.error( 'Captured validation error: ', err.errors[0]);
              return res.json({"code":err.code,"message":err.errors[0].message,"detail":err.errors[0].message});
        })
    

}
const promeniStorno = (req,res) =>{
    
    var storno = Storno.findOne({where:{id:req.body.id}});
    Storno.findOne({where:{id:req.body.id}}).then((id)=>{
        if(id===null){
           return res.json({message:"No Storno",detail:"No Storno with that id"})
        }
        storno.brojNaMernaTocka=req.body.brojNaMernaTocka;
        storno.mesecNaFakturiranje=req.body.mesecNaFakturiranje;
        storno.tarifa=req.body.tarifa;
        storno.datumNaPocetokNaMerenje=req.body.datumNaPocetokNaMerenje;
        storno.datumNaZavrshuvanjeNaMerenje=req.body.datumNaZavrshuvanjeNaMerenje;
        storno.pocetnaSostojba=req.body.pocetnaSostojba;
        storno.krajnaSostojba=req.body.krajnaSostojba;
        storno.kolicina=req.body.kolicina;
        storno.multiplikator=req.body.multiplikator;
        storno.vkupnoKolicina=req.body.vkupnoKolicina;
        storno.nebitno=req.body.nebitno;
        storno.brojNaMernoMesto=req.body.brojNaMernoMesto;
        storno.brojNaBroilo=req.body.brojNaBroilo;
        storno.nebitno2=req.body.nebitno2;
        storno.datumNaIzrabotkaEVN=req.body.datumNaIzrabotkaEVN;
        storno.pomireno=req.body.pomireno;
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
    const stornos = await Storno.findAll({attributes:["id","brojNaMernaTocka", "mesecNaFakturiranje", "tarifa", "datumNaPocetokNaMerenje", "datumNaZavrshuvanjeNaMerenje", "pocetnaSostojba", "krajnaSostojba", "kolicina", "multiplikator", "vkupnoKolicina", "nebitno", "brojNaMernoMesto", "brojNaBroilo", "nebitno2", "datumNaIzrabotkaEVN", "pomireno"],raw : true})
    return res.json(stornos)
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
        console.log(res)
        if(res===null){
            MernaTocka.create({
                tockaID:created.brojNaMernaTocka,
                tarifa:created.tarifa,
                cena:1
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