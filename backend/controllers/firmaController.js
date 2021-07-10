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
    const firma = Firma.findOne({id:req.id});
    Agent.findOne({name:req.agent}).then((agent)=>{
        if(agent===null){
           return res.json({message:"No agent",detail:"No agent with that name"})
        }

    firma.name=req.name;
    firma.broj=req.broj;
    firma.agent=req.agent;
    firma.reload().then(()=>{
        return res.json({message:"Success",detail:"Updated firma"})
    })
    })
    

}
const izbrisiFirma = (req,res) =>{

}

const zemiFirmi = async (req,res) =>{
    
    const firmi = await Firma.findAndCountAll({limit:req.body.limit, offset:req.body.offset, attributes:["id", "name", "broj","agent"],raw : true})
    return res.json(firmi)
}





const uploadFile = async (req,res)=>{

csv({
	noheader: true,
	headers: ['brojMernaTocka','mesec','tarifa','datumPocetok','datumKraj','pocetnaSostojba','krajnaSostojba','kolicina','multiplikator','vkupnoKolicina','nebitno','brojMernoMesto','brojBroilo','prazno','datumOdEvn'],
    delimiter: ";"
})
.fromString(req.files.sensorData.data.toString('utf8'))
.then((jsonObj)=>{
    var sortirani = {};
    var grupirani = {};
    //Sortiraj po pocetna sostojba
    //Workaround za sortiranje po poceten datum
    sortirani = _.sortBy(jsonObj, (res)=>{
        return parseFloat(res["pocetnaSostojba"])
    });

    //Grupiraj po broj na broilo.
    var skroteni = _.chain(sortirani).groupBy("brojBroilo").value()
    
    //Grupiraj po tarifa
    for(var key in skroteni){
        
        grupirani[key] = _.chain(skroteni[key]).groupBy("tarifa").value();
    }

    var niza=[]
    var brojac=-1
    var prv
    for(var brojBroilo in grupirani){
        // console.log(brojBroilo)
        
        
        for(var tarifa in grupirani[brojBroilo]){
            prv=true
            brojac++;
            for(var merka in grupirani[brojBroilo][tarifa]){
            //    console.log(tarifa)
            //    console.log(brojac)
               if(prv){
                    // console.log(brojBroilo)
                    // console.log(tarifa)
                    niza[brojac]=grupirani[brojBroilo][tarifa][merka]
                    prv=false
                }else{
                    
                    niza[brojac].krajnaSostojba=grupirani[brojBroilo][tarifa][merka].krajnaSostojba
                    niza[brojac].kolicina=parseFloat(parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))).toFixed(2)
                    niza[brojac].datumKraj=grupirani[brojBroilo][tarifa][merka].datumKraj
                    niza[brojac].vkupnoKolicina=parseFloat(parseFloat(niza[brojac].multiplikator) * parseFloat(niza[brojac].kolicina)).toFixed(2)  
                    
        }
        }
    }
        niza[brojac].kolicina=parseFloat(parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))).toFixed(2)
        // console.log(niza[brojac].kolicina)
        niza[brojac].vkupnoKolicina=parseFloat(parseFloat(niza[brojac].multiplikator) * parseFloat(niza[brojac].kolicina)).toFixed(2)
        
        
    }
    for( var red in niza){


        BroiloStatus.create({
           brojMernaTocka: niza[red].brojMernaTocka,
           mesec: niza[red].mesec,
           tarifa: niza[red].tarifa,
           datumPocetok: niza[red].datumPocetok,
           datumKraj: niza[red].datumKraj,
           pocetnaSostojba: niza[red].pocetnaSostojba.replace(",","."),
           krajnaSostojba: niza[red].krajnaSostojba.replace(",","."),
           kolicina: niza[red].kolicina.replace(",","."),
           multiplikator: niza[red].multiplikator,
           vkupnoKolicina: niza[red].vkupnoKolicina,
           nebitno: niza[red].nebitno,
           brojMernoMesto: niza[red].brojMernoMesto,
           brojBroilo: niza[red].brojBroilo,
           datumOdEvn: niza[red].datumOdEvn
        })
    }
    
})
 

    
}

module.exports={dodadiFirma, promeniFirma, izbrisiFirma, zemiFirmi, uploadFile}