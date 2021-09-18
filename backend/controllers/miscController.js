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
        if(row!==null){
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
    }
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

const addKamata = async function(req,res){
    const firmaid = req.body.firma
    const arhivskiBroj = req.body.arhivskiBroj
    const suma = req.body.suma
    const rok = req.body.rok
    const platenoData = req.body.platenoData
    console.log(req.body)
    if(firmaid!==undefined &&arhivskiBroj!==undefined &&suma!==undefined &&rok!==undefined){
        console.log("asdasd")
        await Kamata.create({
            firmaid,
            arhivskiBroj,
            suma,
            rok,
            platenoData
        })
    }
    return res.status(200).send()
}


const getKamati= async function(req,res){
    const kamati = await Kamata.findAll({attributes:["id","firmaid", "arhivskiBroj", "fakturaDisplayId", "suma", "rok", "platenoData"],raw : true})
    // for(let i in kamati){
    //     let ime = await Firma.findOne({where: {id:kamati[i]["id"]}, attributes:["name"]}) 
    //     kamati[i]["firmaid"] = ime.dataValues.name
    // }
    return res.json(kamati)
}
const deleteKamata = async function(req,res){
    const kamata = await Kamata.findOne({where:{id:req.body.id}}) 
    await generateLog("Избриша камата",req.session.username,kamata.arhivskiBroj)
    await Kamata.destroy({where:{id:req.body.id}})
    return res.status(200).send()
}
const editKamata = async function(req,res){ 
    const firmaid = req.body.firma
    const arhivskiBroj = req.body.arhivskiBroj
    const suma = req.body.suma
    const rok = req.body.rok
    const platenoData = req.body.platenoData
    await generateLog("Промени камата",req.session.username,arhivskiBroj)
    await Kamata.update({
        firmaid,
        arhivskiBroj,
        suma,
        rok,
        platenoData
    }
    ,{where:{id:req.body.id}})
    return res.status(200).send()
}

module.exports={editKamata,updateZelenaEnergija,updateNagradi,getNagradi,getLogs,getKamati,addKamata,deleteKamata}