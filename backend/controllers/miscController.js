const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const BroiloController=require("../controllers/broiloController")
const Nagradi = require("../models/nagradi")
const generateLog = require("../logs")
const Log = require("../models/log")
const Kamata = require("../models/kamata")
const Firma = require("../models/firma.js")
const db = require('../db.js')  
const { QueryTypes } = require('sequelize');

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

    let logs
    let order
    let order1 = [["id", "desc"]]
    if(req.body.orderDirection!='desc' || req.body.orderDirection!='asc'){
        order = [[req.body.sortField, req.body.orderDirection]]
    }
    logs = await db.query("SELECT * FROM logs WHERE \"message\" LIKE '%"+req.body.search+
                                "%' OR \"actor\" LIKE '%"+req.body.search+
                                "%' OR \"actedon\" LIKE '%"+req.body.search+
                                "%' ORDER BY \""+((order[0][0] == undefined) ? order1[0][0] : order[0][0])+
                                "\" "+((order[0][1] == undefined) ? order1[0][1] : order[0][1])+
                                " LIMIT "+((req.body.pageSize == undefined) ? 20 : req.body.pageSize)+
                                " OFFSET "+(isNaN((req.body.pageSize*(req.body.page))) ? 0 : (req.body.pageSize*(req.body.page))), 
                                { type: QueryTypes.SELECT });
    return res.json({
        count: logs.length,
        rows: logs
    })
}

const addKamata = async function(req,res){
    const firmaid = req.body.firma
    const arhivskiBroj = req.body.arhivskiBroj
    const suma = req.body.suma
    let rok = req.body.rok
    if(rok.length>11)
    {
        let day = rok[8]+rok[9]+""
        let dayTmp = parseInt(day)+1
        dayTmp=dayTmp+""
        if(dayTmp<10){dayTmp="0"+dayTmp}
        day=dayTmp
        let month = rok[5]+rok[6]+""
        let year = rok[0]+rok[1]+rok[2]+rok[3]+""
        rok = day+"-"+month+"-"+year
    }
    let platenoData = req.body.platenoData
    if(platenoData.length>11)
    {
        let day1 = platenoData[8]+platenoData[9]+""
        let dayTmp = parseInt(day1)+1
        dayTmp=dayTmp+""
        if(dayTmp<10){dayTmp="0"+dayTmp}
        day1=dayTmp
    let month1 = platenoData[5]+platenoData[6]+""
        let year1 = platenoData[0]+platenoData[1]+platenoData[2]+platenoData[3]+""
        platenoData = day1+"-"+month1+"-"+year1
    }
    if(firmaid!==undefined &&arhivskiBroj!==undefined &&suma!==undefined &&rok!==undefined){
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
    console.log(req.body)
    let whereObj = 
    {
        
    }
    try{

    
    for(filter1 of req.body.filters){
            if(filter1.value.length !==0){
                // console.log(filter1)
                if(filter1.column.field === "faktura"){

                    whereObj[filter1.column.field] = {[Op.like]:"%"+filter1.value+"%"}
                }
                else if(filter1.column.field === "rok" || filter1.column.field === "platenoData"){
                    let a = new Date(filter1.value)
                    console.log(a.getDate()+"-"+parseInt(a.getMonth()+1)+"-"+a.getFullYear())
                    whereObj[filter1.column.field] = a.getDate()+"-"+parseInt(a.getMonth()+1)+"-"+a.getFullYear()
                }
                else{
                    whereObj[filter1.column.field] = filter1.value

                }
            }
        
    }
}
catch(e){}

    // console.log(whereObj)
    
    let kamati = await Kamata.findAndCountAll({where:whereObj,
    order: [
        [req.body.sortField,req.body.orderDirection]
    ],
    limit:req.body.pageSize,
    offset:req.body.pageSize*req.body.page
})
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
    let rok = req.body.rok
    if(rok.length>11)
    {
        let day = rok[8]+rok[9]+""
        let dayTmp = parseInt(day)+1
        dayTmp=dayTmp+""
        if(dayTmp<10){dayTmp="0"+dayTmp}
        day=dayTmp
        let month = rok[5]+rok[6]+""
        let monthTmp = parseInt(month)
        monthTmp=monthTmp+""
        if(monthTmp<10){monthTmp="0"+monthTmp}
        month=monthTmp
        let year = rok[0]+rok[1]+rok[2]+rok[3]+""
        rok = day+"-"+month+"-"+year
    }
    let platenoData = req.body.platenoData
    if(platenoData.length>11)
    {
        let day1 = platenoData[8]+platenoData[9]+""
        let dayTmp = parseInt(day1)+1
        dayTmp=dayTmp+""
        if(dayTmp<10){dayTmp="0"+dayTmp}
        day1=dayTmp
        let month1 = platenoData[5]+platenoData[6]+""
        let monthTmp = parseInt(month1)
        monthTmp=monthTmp+""
        if(monthTmp<10){monthTmp="0"+monthTmp}
        month1=monthTmp
        let year1 = platenoData[0]+platenoData[1]+platenoData[2]+platenoData[3]+""
        platenoData = day1+"-"+month1+"-"+year1
    }
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