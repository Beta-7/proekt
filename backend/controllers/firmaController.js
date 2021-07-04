const express = require("express")
const db = require("../db.js")
const Firma = require("../models/firma.js")
const User = require("../models/users")
const bcrypt = require("bcryptjs")
const app = express()
const session=require("express-session")

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
const uploadFile = (req,res)=>{
    return res.json({"message":"good job"})
}

module.exports={dodadiFirma, uploadFile}