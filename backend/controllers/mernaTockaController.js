
const BroiloStatus = require("../models/broiloStatus")
const Firma = require("../models/firma")
const MernaTocka = require("../models/mernaTocka")
const BroiloController = require("./broiloController")
const generateLog = require("../logs")
const dodadiMernaTocka = (req, res) => {
    //tockaID
    //cena
    //firma
    //tarifa
    const tockaID=req.body.tockaID
    const cena=parseFloat(req.body.cena)
    const firmaID=req.body.firmaID
    let tarifa=req.body.tarifa
    if(tarifa == 0){
        tarifa="1.1.1.8.1.255"
    }
    if(tarifa == 1){
        tarifa="1.1.1.8.2.255"
    }
    

    MernaTocka.findOne({where:{tockaID: req.body.tockaID, tarifa}}).then((user)=>{
        if(user!==null){
            return res.json({"message":"Error","detail":"Merna tocka already exists"})
        }
        Firma.findOne({where:{id:firmaID}}).then((firma)=>{

            MernaTocka.create({
                tockaID,
                cena,
                "firmaId":firma.id,
                tarifa
            }).then(()=>{
                generateLog("Асоцира мерна точка со компанија",req.session.username, tockaID)
                return res.send({"message":"success","detail":"Successfully added company"})})    
        })


       
    })
    
}

async function promeniMernaTocka(req,res){
        //id
        //firmaID
        //cena
        //tarifa
    const MT = await MernaTocka.findOne({where:{
        id:req.body.id
    }})
    const firma = await Firma.findOne({where:{
        id:req.body.firmaId
    }})
    if(MT.length === null || firma === null){
        return res.json({"message":"error","detail":"MernaTocka or Firma doesn't exist"})
    }

    MernaTocka.update({firmaId:req.body.firmaId,cena:req.body.cena}, {
        where:{id:req.body.id}
    }).then(()=>{
        generateLog("Асоцира мерна точка со компанија",req.session.username, MT.tockaID)
        return res.json({message:"Success",detail:"Updated Merna Tocka"})
    })

}
const izbrisiMernaTocka = async (req, res) =>{
    const MT = await MernaTocka.findOne({where:{
        id:req.body.id
    }})
    MernaTocka.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
        generateLog("Избриша мерна точка",req.session.username, MT.tockaID)
        return res.json({message:"Success",detail:"Deleted Merna Tocka"})
    }).catch(()=>{
        return res.json({message:"Error",detail:"Failed to delete Merna Tocka"})
    })
}

const getMerniTocki= async function(req,res){
    const tocki = await MernaTocka.findAll({attributes:["id","tockaID", "cena","tarifa" ,"firmaId"],raw : true})
    BroiloController.asocirajBroiloSoKompanija()
    return res.json(tocki)
}

module.exports={dodadiMernaTocka,promeniMernaTocka,izbrisiMernaTocka,getMerniTocki}