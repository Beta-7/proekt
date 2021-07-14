const express = require("express")

const Firma = require("../models/firma.js")
const User = require("../models/users")
const BroiloStatus = require("../models/broiloStatus")

const csv=require("csvtojson");

const _ = require('lodash');

const dodadiFirma = (req, res) => {
    const name=req.body.name;
    const broj=req.body.broj;
    const agent=req.body.agent;

    User.findOne({where:{username: agent}}).then((user)=>{
        if(user===null){
            return res.json({"message":"No agent","detail":"No agent with that username"})
        }

        Firma.create({
            name,
            broj,
            agent
        }).then(()=>{return res.send({"message":"success","detail":"Successfully added company"})}).catch(err=>{
          
            console.error( 'Captured validation error: ', err.errors[0]);
            
            return res.json({"code":err.code,"message":err.errors[0].message,"detail":err.errors[0].message});
        })
    })
    

}
const promeniFirma = (req,res) =>{
    
    const firma = Firma.findOne({where:{id:req.body.id}});
    User.findOne({where:{username:req.body.agent}}).then((agent)=>{
        if(agent===null){
           return res.json({message:"No agent",detail:"No agent with that name"})
        }

    firma.name=req.body.name;
    firma.broj=req.body.broj;
    firma.agent=req.body.agent;
    Firma.update(firma, {
        where:{id:req.body.id}
    }).then(()=>{
        return res.json({message:"Success",detail:"Updated firma"})
    })
    })
    

}
const izbrisiFirma = (req,res) =>{
    Firma.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
        return res.json({message:"Success",detail:"Deleted company"})
    }).catch(()=>{
        return res.json({message:"Error",detail:"Failed to delete company"})
    })
}

const zemiFirmi = async (req,res) =>{
    
    const firmi = await Firma.findAndCountAll({limit:req.body.limit, offset:req.body.offset, attributes:["id", "name", "broj","agent"],raw : true})
    return res.json(firmi)
}



module.exports={dodadiFirma, promeniFirma, izbrisiFirma, zemiFirmi}