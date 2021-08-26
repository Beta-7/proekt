const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const BroiloController=require("../controllers/broiloController")
const Nagradi = require("../models/nagradi")
const generateLog = require("../logs")
const Log = require("../models/log")
const Kamata = require("../models/kamata")
const Firma = require("../models/firma.js")

const updateZelenaEnergija = (req, res) => {
    req.body.mesec=parseInt(req.body.mesec)
    req.body.godina=parseInt(req.body.godina)
    if(req.body.mesec < 1 && req.body.mesec > 12 || isNaN(req.body.mesec)){
        return res.json({"message":"error","detail":"bad format"})        
    }
    if(req.body.godina < 2020 && req.body.godina > 2100 || isNaN(req.body.mesec)){
        return res.json({"message":"error","detail":"bad format"})        
    }
    

    try{
    var vkupnoPotrosena=0

    
    VkupnoPotrosena.findOne({
        where:
        {
            mesec:req.body.mesec,
            godina:req.body.godina
        }
    }).then((row)=>{
        row.zelenaKolicina=req.body.vkupno
        row.zelenaCena=req.body.cena
        vkupnoPotrosena = row.vkupnoPotrosena
        row.update({
            zelenaKolicina:req.body.vkupno,
            zelenaCena:req.body.cena,
            nadomestZaOrganizacija:req.body.organizacija,
            kamatnaStapka:req.body.kamata,
            DDVProcent:req.body.DDVProcent
        })
    }).then(()=>{
        BroiloController.presmetajProcent(req.body.mesec,req.body.godina, vkupnoPotrosena, req.body.vkupno)

    })
    generateLog("Ажурира податоци за месец",req.session.username, (req.body.mesec+"."+req.body.godina))
    return res.json({"message":"success","detail":"updated"})
    }
    catch{

        return res.json({"message":"error","detail":"error"})
    }

}

const getNagradi = async (req, res)=>{
    const nagradi = await Nagradi.findAndCountAll({limit:req.body.limit, offset:req.body.offset, attributes:["id", "agent", "suma","mesec","godina","firma","pomireno"],raw : true})
    return res.json(nagradi)
}

const updateNagradi = (req, res) => {

    const id = req.body.id
    const pomireno = req.body.pomireno
    if(id===undefined){
        return res.json({"error":"missing id","details":"supply id parameter"})
    }

    if(pomireno===undefined){
        return res.json({"error":"missing pomireno","details":"supply pomireno parameter"})
    }

    Nagradi.findOne({where:{id}}).then((nagrada)=>{
        nagrada.update({pomireno})
    
    generateLog("Ажурира награда за агент",req.session.username, nagrada.agent )
    return res.json({"error":"none","details":"updated nagrada"})
})
}

const getLogs = async (req, res)=>{
    const logs = await Log.findAndCountAll({limit:req.body.limit, offset:req.body.offset, attributes:["id","message", "actor","actedon","createdAt"],raw : true,order: [
        ['id', 'DESC'],
    ]})
    return res.json(logs)
}


const getKamati= async function(req,res){
    const kamati = await Kamata.findAll({attributes:["id","firmaid", "fakturaStoKasniId", "fakturaDisplayId", "suma", "rok", "platenoData"],raw : true})
    for(let i in kamati){
        let ime = await Firma.findOne({where: {id:kamati[i]["id"]}, attributes:["name"]}) 
        kamati[i]["firmaid"] = ime.dataValues.name
    }
    return res.json(kamati)
}

module.exports={updateZelenaEnergija,updateNagradi,getNagradi,getLogs,getKamati}