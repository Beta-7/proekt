const BroiloStatus = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const csv=require("csvtojson");
const _ = require('lodash');

const getBroilos= async function(req,res){
    const broilos = await BroiloStatus.findAll({attributes:["id","brojMernaTocka","mesec", "tarifa", "datumPocetok", "datumKraj", "pocetnaSostojba", "krajnaSostojba", "kolicina", "multiplikator", "vkupnoKolicina", "nebitno", "brojMernoMesto", "brojBroilo", "datumOdEvn"],raw : true})
    return res.json(broilos)
}

const uploadFile = async (req,res)=>{
    var vkupnoPotrosena=0
    var mesec
    var godina
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

            
            niza[brojac].kolicina=parseFloat(parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))).toFixed(2)
            // console.log(niza[brojac].kolicina)
            niza[brojac].vkupnoKolicina=parseFloat(parseFloat(niza[brojac].multiplikator) * parseFloat(niza[brojac].kolicina)).toFixed(2)
        }
            
            
            
        }
        for( var red in niza){
            // console.log(niza[red].vkupnoKolicina)
            vkupnoPotrosena=parseFloat(parseFloat(vkupnoPotrosena)+parseFloat(niza[red].vkupnoKolicina.replace(",","."))).toFixed(2)
            mesec=niza[red].mesec.slice(5,7)
            godina=niza[red].mesec.slice(0,4)
            MernaTocka.findOrCreate({ where: { tockaID: niza[red].brojMernaTocka, tarifa:niza[red].tarifa },
                defaults: {
                    tockaID:niza[red].brojMernaTocka,
                    cena:0,
                    tarifa:niza[red].tarifa
                }
            }
            )
            
    
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
            }).then(()=>{
               
            })

        }
        VkupnoPotrosena.create({
            mesec,
            godina,
            vkupnoPotrosena
        }).then(()=>{
            asocirajBroiloSoKompanija()
        })


        
    })
    
    
        
    }

function presmetajProcent(mesec, godina, vkupnoPotrosena, vkupnaZelenaEnergija){
    BroiloStatus.findAll({where:{
        mesec:godina+"."+mesec+"-"+mesec
    }}).then((results)=>{
        results.map((row)=>{
            const procentOdVkupnoPotrosenaEnergija = parseFloat(row.vkupnoKolicina / vkupnoPotrosena * 100).toFixed(2)
            const vkupnaPotroshenaZelenaOdKlient = parseFloat(procentOdVkupnoPotrosenaEnergija * (parseFloat(vkupnaZelenaEnergija)/100.00)).toFixed(2)
            row.update({
                procentOdVkupnoPotrosenaEnergija:procentOdVkupnoPotrosenaEnergija,
                potrosenaZelenaEnergija:vkupnaPotroshenaZelenaOdKlient
            })

        })
    })
}

async function asocirajBroiloSoKompanija(){
    // pomini gi site broilostatus,
    // zemi merna tocka od broilo status, zemi firma id preku tabela merna tocka i asociraj ja kompanijata so broilostatus
    
    BroiloStatus.findAll().then((broilos)=>{
        broilos.forEach(broilo => {
            MernaTocka.findOne({where:{
               tockaID:broilo.brojMernaTocka 
            }}).then((mernatocka)=>{
                BroiloStatus.update({firmaId:mernatocka.firmaId},{where:{
                    id:broilo.id
                }}).then(()=>{
                    return
                })
            })
        });
    })

}









module.exports={getBroilos, uploadFile, asocirajBroiloSoKompanija,presmetajProcent}