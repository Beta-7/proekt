const BroiloStatus = require("../models/broiloStatus")
const MernaTocka = require("../models/mernaTocka")
const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const csv=require("csvtojson");
const _ = require('lodash');
const { isNull } = require("lodash");
const generateLog = require("../logs")

const getBroilos= async function(req,res){
    const broilos = await BroiloStatus.findAll({attributes:["id","brojMernaTocka","mesec", "tarifa", "datumPocetok", "datumKraj", "pocetnaSostojba", "krajnaSostojba", "kolicina", "multiplikator", "vkupnoKolicina", "nebitno", "brojMernoMesto", "brojBroilo", "datumOdEvn"],raw : true})
    return res.json(broilos)
}

const uploadFile = async (req,res)=>{
    //console.log(req.session)
    generateLog("Прикачи фајл со состојба на броилата",req.session.username)
   new Promise((reject, success)=>{

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

            
            
            for(var tarifa in grupirani[brojBroilo]){
                prv=true
                brojac++;
                for(var merka in grupirani[brojBroilo][tarifa]){

                   if(prv){

                        niza[brojac]=grupirani[brojBroilo][tarifa][merka]
                        prv=false
                    }else{
                        
                        niza[brojac].krajnaSostojba=grupirani[brojBroilo][tarifa][merka].krajnaSostojba
                        niza[brojac].kolicina=parseFloat(parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))).toFixed(10)
                        niza[brojac].datumKraj=grupirani[brojBroilo][tarifa][merka].datumKraj
                        niza[brojac].vkupnoKolicina=parseFloat(parseFloat(niza[brojac].multiplikator) * parseFloat(niza[brojac].kolicina)).toFixed(10)
                        
            }
            }

            
            niza[brojac].kolicina=parseFloat(parseFloat(niza[brojac].krajnaSostojba.replace(",", "."))-parseFloat(niza[brojac].pocetnaSostojba.replace(",", "."))).toFixed(10)

            niza[brojac].vkupnoKolicina=parseFloat(parseFloat(niza[brojac].multiplikator) * parseFloat(niza[brojac].kolicina)).toFixed(10)
        }
            
            
            
        }
        for( let red in niza){
            vkupnoPotrosena=parseFloat(parseFloat(vkupnoPotrosena)+parseFloat(niza[red].vkupnoKolicina.replace(",","."))).toFixed(10)
            mesec=niza[red].mesec.slice(5,7)
            godina=niza[red].mesec.slice(0,4)
            //console.log(niza[red])
            if(niza[red].brojMernaTocka!==null && niza[red].tarifa!==null){

                MernaTocka.findOrCreate({ where: { tockaID: niza[red].brojMernaTocka },
                    defaults: {
                        tockaID:niza[red].brojMernaTocka,
                        cenaVT:0,
                        cenaNT:0,
                        tarifa:niza[red].tarifa
                    }
                }
                )
            }
                
            BroiloStatus.findOne({where:{
                brojMernaTocka: niza[red].brojMernaTocka,
                mesec: niza[red].mesec,
                tarifa: niza[red].tarifa,
                datumPocetok: niza[red].datumPocetok,
                datumKraj: niza[red].datumKraj,
                pocetnaSostojba: niza[red].pocetnaSostojba.replace(",","."),
                krajnaSostojba: niza[red].krajnaSostojba.replace(",","."),
                // koga ke se otvori so excel se krsi formatot. doveduva do duplikati
                // brojMernoMesto: niza[red].brojMernoMesto,
                // brojBroilo: niza[red].brojBroilo,
                datumOdEvn: niza[red].datumOdEvn
            }}).then((broilo)=>{
                if(broilo===null){
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
        VkupnoPotrosena.findOne({where:{
            mesec, godina
        }}).then((rezultat)=>{
            if(isNull(rezultat)){
                VkupnoPotrosena.create({
                    mesec,
                    godina,
                    vkupnoPotrosena
                }).then(()=>{
                    asocirajBroiloSoKompanija()
                })
            }
            else{
                asocirajBroiloSoKompanija()
            }
        })
        


        
    })
    
    
    return res.json({"message":"success","detail":"uploaded file"})
})     
    }

function presmetajProcent(mesec, godina, vkupnoPotrosena, vkupnaZelenaEnergija){
    if(mesec<10){
        var tempmesec="0"+mesec
    }
    
    BroiloStatus.findAll({where:{
        mesec:godina+"."+tempmesec+"-"+tempmesec
    }}).then((results)=>{
        results.map((row)=>{
            const procentOdVkupnoPotrosenaEnergija = parseFloat(row.vkupnoKolicina / vkupnoPotrosena * 100).toFixed(10)

            const vkupnaPotroshenaZelenaOdKlient = parseFloat(procentOdVkupnoPotrosenaEnergija * (parseFloat(vkupnaZelenaEnergija)/100.00)).toFixed(10)
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
    let broila = await BroiloStatus.findAll()
    for(broilo of broila){
        let mernaTocka = await MernaTocka.findOne({where:{
            tockaID:broilo.brojMernaTocka 
        }})
        if(mernaTocka!==null){
            await BroiloStatus.update({firmaId:mernaTocka.firmaId},{where:{
                id:broilo.id
            }})
            //console.log("Asociram "+broilo.id+" so "+mernaTocka.firmaId)
        }
    }
}









module.exports={getBroilos, uploadFile, asocirajBroiloSoKompanija,presmetajProcent}