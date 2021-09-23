const BroiloStatus = require("../models/broiloStatus")
const Firma = require("../models/firma")
const MernaTocka = require("../models/mernaTocka")
const BroiloController = require("./broiloController")
const generateLog = require("../logs")
const db = require('../db.js')  
const { QueryTypes } = require('sequelize');


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
    let tocki
    let order
    let order1 = [["id", "desc"]]
    if(req.body.orderDirection!='desc' || req.body.orderDirection!='asc'){
        order = [[req.body.sortField, req.body.orderDirection]]
    }
    tocki = await db.query("SELECT *,\"firmas\".\"name\" FROM \"mernaTockas\" LEFT JOIN public.\"firmas\" ON \"mernaTockas\".\"firmaId\" = \"firmas\".\"id\" WHERE \"firmas\".\"name\" LIKE '%"+req.body.search+
                                "%' OR \"tockaID\" LIKE '%"+req.body.search+
                                "%' OR \"cenaNT\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"cenaVT\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"firmaId\"::TEXT LIKE '%"+req.body.search+
                                "%' OR \"adresa\" LIKE '%"+req.body.search+
                                "%' OR \"brojMestoPotrosuvacka\" LIKE '%"+req.body.search+
                                "%' ORDER BY \""+((order[0][0] == undefined) ? order1[0][0] : order[0][0])+
                                "\" "+((order[0][1] == undefined) ? order1[0][1] : order[0][1])+
                                " LIMIT "+((req.body.pageSize == undefined) ? 20 : req.body.pageSize)+
                                " OFFSET "+(isNaN((req.body.pageSize*(req.body.page))) ? 0 : (req.body.pageSize*(req.body.page))), 
                                { type: QueryTypes.SELECT });


    // tocki = await db.query("SELECT * FROM \"mernaTockas\" WHERE \"tockaID\" LIKE '%"+req.body.search+
    //                             "%' OR \"cenaNT\"::TEXT LIKE '%"+req.body.search+
    //                             "%' OR \"cenaVT\"::TEXT LIKE '%"+req.body.search+
    //                             "%' OR \"firmaId\"::TEXT LIKE '%"+req.body.search+
    //                             "%' OR \"adresa\" LIKE '%"+req.body.search+
    //                             "%' OR \"brojMestoPotrosuvacka\" LIKE '%"+req.body.search+
    //                             "%' ORDER BY \""+((order[0][0] == undefined) ? order1[0][0] : order[0][0])+
    //                             "\" "+((order[0][1] == undefined) ? order1[0][1] : order[0][1])+
    //                             " LIMIT "+((req.body.pageSize == undefined) ? 20 : req.body.pageSize)+
    //                             " OFFSET "+(isNaN((req.body.pageSize*(req.body.page))) ? 0 : (req.body.pageSize*(req.body.page))), 
    //                             { type: QueryTypes.SELECT });

    return res.json({
        count: tocki.length,
        rows: tocki
    })
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