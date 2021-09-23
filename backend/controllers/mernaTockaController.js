
const Firma = require("../models/firma")
const MernaTocka = require("../models/mernaTocka")
const generateLog = require("../logs")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const dodadiMernaTocka = (req, res) => {

    const tockaID=req.body.tockaID
    const cenaVT=parseFloat(req.body.cenaVT)
    const cenaNT=parseFloat(req.body.cenaNT)
    const firmaID=req.body.firmaID
    const tarifa=req.body.tarifa
    if(tockaID===undefined || isNaN(parseFloat(cenaVT)) || isNaN(parseFloat(cenaNT)) || firmaID===undefined || tarifa===undefined){
        return res.json({"message":"Error","detail":"Missing argument"})
    }
    if(tarifa == 0){
        tarifa="1.1.1.8.2.255"
    }
    if(tarifa == 1){
        tarifa="1.1.1.8.1.255"
    }
    

    MernaTocka.findOne({where:{tockaID: req.body.tockaID}}).then((user)=>{
        if(user!==null){
            return res.json({"message":"Error","detail":"Merna tocka already exists"})
        }
        Firma.findOne({where:{id:firmaID}}).then((firma)=>{

            MernaTocka.create({
                tockaID,
                cenaVT,
                cenaNT,
                firmaId:firma.id,
                
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

    MernaTocka.update({
        firmaId:req.body.firmaId,
        cenaVT:req.body.cenaVT,
        cenaNT:req.body.cenaNT, 
        adresa:req.body.adresa,
        brojMestoPotrosuvacka:req.body.brojMestoPotrosuvacka
    }, {where:{id:req.body.id}
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
    let whereObj = 
    {
        
    }
    for(filter1 of req.body.filters){
            if(filter1.value.length !==0){
                console.log(filter1)
                if(filter1.column.field === "tockaID" ||filter1.column.field === "adresa" ){

                    whereObj[filter1.column.field] = {[Op.like]:"%"+filter1.value+"%"}
                }
                else{
                    whereObj[filter1.column.field] = filter1.value

                }
            }
        
    }
    console.log(whereObj)

    
    
    let merniTocki = await MernaTocka.findAndCountAll({where:whereObj,
    order: [
        [req.body.sortField,req.body.orderDirection]
    ],
    limit:req.body.pageSize,
    offset:req.body.pageSize*req.body.page
})
// console.log(merniTocki)
    return res.json(merniTocki)
}

const najdiNeasocirani = async function(req,res){
    const tocka = await MernaTocka.findOne({where:{
        firmaId:null
    }})
    if(tocka!=null){
        return res.json({message:"true"})
    }else{
        return res.json({message:"false"})
    }
}


module.exports={dodadiMernaTocka,promeniMernaTocka,izbrisiMernaTocka,getMerniTocki,najdiNeasocirani}