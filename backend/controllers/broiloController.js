const BroiloStatus = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const Firma = require("../models/firma")
const csv=require("csvtojson");
const _ = require('lodash');

const getBroilos= async function(req,res){
    const broilos = await BroiloStatus.findAll({attributes:["brojMernaTocka","mesec", "tarifa", "datumPocetok", "datumKraj", "pocetnaSostojba", "krajnaSostojba", "kolicina", "multiplikator", "vkupnoKolicina", "nebitno", "brojMernoMesto", "brojBroilo", "datumOdEvn"],raw : true})
    return res.json(broilos)
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
            MernaTocka.findOne({ where: { tockaID: niza[red].brojMernaTocka }}).then((MT)=>{
                if(MT !== null){
                    console.log("Mernata tocka postoi")
                }
                else{
                    console.log("Mernata tocka ne postoi`")
                }
            });
            

    
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



async function asocirajBroilo(req,res){
        //brojBroilo
        //firmaID
    const broilo = await BroiloStatus.findAll({where:{
        brojBroilo:req.body.brojBroilo
    }})
    const firma = await Firma.findOne({where:{
        id:req.body.firmaId
    }})
    if(broilo.length === 0 || firma === null){
        return res.json({"message":"error","detail":"Broilo or Firma doesn't exist"})
    }

    BroiloStatus.update({firmaId:req.body.firmaId}, {
        where:{brojBroilo:req.body.brojBroilo}
    }).then(()=>{
        return res.json({message:"Success",detail:"Updated Broilo"})
    })

}





module.exports={getBroilos, uploadFile, asocirajBroilo}