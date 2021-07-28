const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")
const VkupnoPotrosena = require("../models/vkupnoPotrosena.js")
const MernaTocka = require("../models/mernaTocka.js")

function formatDate(date){
    var newDate = new Date(date)
    // console.log(newDate)
    console.log(newDate.getDate() + "-" + parseInt(newDate.getMonth()+1) + "-" + newDate.getFullYear())
    
    return newDate.getDate() + "-" + parseInt(newDate.getMonth()+1) + "-" + newDate.getFullYear()
}

const generirajFakturi = async function(req, res){
    // 1. Pomini gi site firmi
    // 2. Proveri dali firmata ima broiloStatus za ovoj mesec
    // 3. Ako ima spoj gi i kreiraj red vo tabelata
    var godina = req.body.godina
    var mesec = req.body.mesec
    godina="2021"
    mesec="03"
    // console.log("asd "+Faktura.Instance.Prototype)
    Firma.findAll({
        //TODO: da raboti
    }).then((result)=>{
        result.map((firma)=>{
            var date = new Date()
            var rok = new Date()
            rok.setDate(date.getDate()+10)
            Faktura.create({
                brojNaFaktura:"05-2021",
                mesec:03,
                godina:2021,
                datumNaIzdavanje: formatDate(date),
                rokZaNaplata: formatDate(rok),
                firmaId:firma.id
            }).then((faktura)=>{
                console.log(godina+"."+mesec+"-"+mesec)
                firma.getBroilo({
                    where:{
                        mesec:godina+"."+mesec+"-"+mesec
                    }
                }).then((result)=>{
                    var kolicinaOdSiteBroila=0
                    var kolicinaZelenaEnergija=0
                    var promeni = {}
                    result.map((broilo)=>{
                        //TODO: Da se presmetaat vrednostite vo Faktura polinjata i da se popolnat tuka
                        MernaTocka.findOne({where:{
                            tockaID:broilo.brojMernaTocka,
                            tarifa:broilo.tarifa
                        }}).then((mernaTocka)=>{
                            VkupnoPotrosena.findOne({where:{
                                mesec,
                                godina
                            }}).then((vkupnoPotrosena)=>{
                                console.log(faktura.id + " ima broilo " + broilo.id + " so potrosena "+broilo.vkupnoKolicina)
                                kolicinaOdSiteBroila=parseFloat(kolicinaOdSiteBroila)+parseFloat(broilo.vkupnoKolicina)
                                kolicinaZelenaEnergija=parseFloat(kolicinaZelenaEnergija) + parseFloat(broilo.potrosenaZelenaEnergija)
                                console.log("Toa e "+ parseInt(kolicinaOdSiteBroila-kolicinaZelenaEnergija) + " kWh obicna i " + kolicinaZelenaEnergija + " kWh zelena")
                                faktura.addBroilo(broilo)
                                
                                promeni={
                                    elektricnaEnergija:parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija).toFixed(2),
                                    obnovlivaEnergija:parseFloat(kolicinaZelenaEnergija).toFixed(2),
                                    dataOd:broilo.datumPocetok,
                                    dataDo:broilo.datumKraj,
                                    cenaKwhBezDDV:parseFloat(mernaTocka.cena).toFixed(2),
                                    vkupenIznosBezDDV:parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija) * parseFloat(mernaTocka.cena)).toFixed(2),
                                    cenaObnovlivaEnergija:parseFloat(vkupnoPotrosena.zelenaCena).toFixed(2),
                                    vkupnaObnovlivaEnergijaBezDDV:parseFloat(parseFloat(vkupnoPotrosena.zelenaCena)*parseFloat(kolicinaZelenaEnergija)).toFixed(2),
                                    nadomestZaOrganizacija:parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija)*parseFloat(vkupnoPotrosena.nadomestZaOrganizacija)).toFixed(2),
                                    vkupenIznosNaFakturaBezDDV:parseFloat(parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija) * parseFloat(mernaTocka.cena))+parseFloat(parseFloat(vkupnoPotrosena.zelenaCena)*parseFloat(kolicinaZelenaEnergija))+parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija)*parseFloat(vkupnoPotrosena.nadomestZaOrganizacija))).toFixed(2),
                                    DDV:parseFloat(parseFloat(vkupnoPotrosena.DDVProcent)/100.0*(parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija) * parseFloat(mernaTocka.cena))+parseFloat(parseFloat(vkupnoPotrosena.zelenaCena)*parseFloat(kolicinaZelenaEnergija))+parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija)*parseFloat(vkupnoPotrosena.nadomestZaOrganizacija)))).toFixed(2),
                                    vkupnaNaplata:parseFloat(parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija) * parseFloat(mernaTocka.cena))+parseFloat(parseFloat(vkupnoPotrosena.zelenaCena)*parseFloat(kolicinaZelenaEnergija))+parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija)*parseFloat(vkupnoPotrosena.nadomestZaOrganizacija))+parseFloat(parseFloat(vkupnoPotrosena.DDVProcent)/100.0*(parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija) * parseFloat(mernaTocka.cena))+parseFloat(parseFloat(vkupnoPotrosena.zelenaCena)*parseFloat(kolicinaZelenaEnergija))+parseFloat(parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija)*parseFloat(vkupnoPotrosena.nadomestZaOrganizacija))))).toFixed(2)
                                }
                                Faktura.update(promeni,{where:{
                                    id:faktura.id
                                }})
                            })
                            
                        })
                        
                        
                    })
                })
            })
            })
    })


    return 
}


const zemiFaktura = async function(req, res){
    // Zemi red od tabelata i generiraj pdf/excel fajl
    // const izbor = req.body.izbor;
    // if(izbor !== "pdf" && izbor !== "excel"){
    //     return res.json({"message":"Invalid input","detail":"izbor must be pdf or excel"})
    // }

    Faktura.findOne({where:
    {
        firmaId:req.body.firmaId,
        mesec:req.body.mesec,
        godina:req.body.godina
    },
    include: {
        model: BroiloStatus,
        as: "Broilo"
    }
    }).then((result)=>{
        console.log("Fakturata so id "+result.id + " za kompanijata "+result.firmaId+" ima broila so id")
        result.Broilo.map((broilo)=>{
            console.log(broilo.id)
        })
    })

    


}



module.exports={generirajFakturi, zemiFaktura}