
const BroiloStatus = require("../models/broiloStatus")
const Firma = require("../models/firma")
const MernaTocka = require("../models/mernaTocka")
const BroiloController = require("./broiloController")

const dodadiMernaTocka = (req, res) => {
    //tockaID
    //cena
    //firma
    const tockaID=req.body.tockaID
    const cena=parseFloat(req.body.cena)
    const firmaID=req.body.firmaID

    MernaTocka.findOne({where:{tockaID: req.body.tockaID}}).then((user)=>{
        if(user!==null){
            return res.json({"message":"Error","detail":"Merna tocka already exists"})
        }
        Firma.findOne({where:{id:firmaID}}).then((firma)=>{

            MernaTocka.create({
                tockaID,
                cena,
                "firmaId":firma.id
            }).then(()=>{
                return res.send({"message":"success","detail":"Successfully added company"})})    
        })


       
    })
    
}

async function promeniMernaTocka(req,res){
        //id
        //firmaID
        //cena
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
        return res.json({message:"Success",detail:"Updated Merna Tocka"})
    })

}
const izbrisiMernaTocka = (req, res) =>{
    MernaTocka.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
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