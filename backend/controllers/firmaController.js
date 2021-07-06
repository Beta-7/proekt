const express = require("express")
const db = require("../db.js")
const Firma = require("../models/firma.js")
const User = require("../models/users")
const bcrypt = require("bcryptjs")
const app = express()
const session=require("express-session")
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
                    niza[brojac].kolicina=parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))
                    prv=false
                }else{
                    
                    niza[brojac].krajnaSostojba=grupirani[brojBroilo][tarifa][merka].krajnaSostojba
                    niza[brojac].kolicina=parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))
                    niza[brojac].datumKraj=grupirani[brojBroilo][tarifa][merka].datumKraj
                    
        }
        }
    }
        niza[brojac].kolicina=parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))
        console.log(brojac)
        
    }
    console.log(JSON.stringify(niza))
    
})
 

    
}

module.exports={dodadiFirma, uploadFile}