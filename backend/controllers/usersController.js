const express = require("express")

const Firma = require("../models/firma.js")
const User = require("../models/users.js")
const BroiloStatus = require("../models/broiloStatus")
const generateLog = require("../logs")
const csv=require("csvtojson");

const _ = require('lodash');

const dodadiUser = (req, res) => {
    const username=req.body.username;
    const ime=req.body.ime;
    const prezime=req.body.prezime;
    const isAdmin=req.body.isAdmin;
    const password="password";

    User.findOne({where:{username: username}}).then((user)=>{
        if(!(user===null)){
            return res.json({"message":"Not unique","detail":"Username must be unique"})
        }

        User.create({
            username,
            password,
            ime,
            prezime,
            isAdmin
        }).then(()=>{
            generateLog("Додаде нов корисник",req.session.username, req.body.username)
            return res.send({"message":"success","detail":"Successfully added user"})}).catch(err=>{
          
            console.error( 'Captured validation error: ', err.errors[0]);
            
            return res.json({"code":err.code,"message":err.errors[0].message,"detail":err.errors[0].message});
        })
    })
    

}
const promeniUser = (req,res) =>{
    
    var user = User.findOne({where:{id:req.body.id}});
    User.findOne({where:{id:req.body.id}}).then((id)=>{
        if(id===null){
           return res.json({message:"No user",detail:"No user with that id"})
        }
    user.ime=req.body.ime;
    user.prezime=req.body.prezime;
    user.isAdmin=req.body.isAdmin;
    User.update(user, {
        where:{id:req.body.id}
    }).then(()=>{
        generateLog("Промени веќе постоечки корисник",req.session.username, req.body.username)
        return res.json({message:"Success",detail:"Updated User"})
        
    })
    })
    

}
const izbrisiUser = async (req,res) =>{
    const user = await User.findOne({where:{id:req.body.id}})
    User.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
        generateLog("Избриша корисник",req.session.username, user.username)
        return res.json({message:"Success",detail:"Deleted User"})
    }).catch(()=>{
        return res.json({message:"Error",detail:"Failed to delete User"})
    })
}








module.exports={dodadiUser, promeniUser, izbrisiUser}