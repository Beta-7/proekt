const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")
const VkupnoPotrosena = require("../models/vkupnoPotrosena.js")
const MernaTocka = require("../models/mernaTocka.js")
const Nagradi = require("../models/nagradi.js")
const StornoDisplay = require("../models/stornoDisplay.js")
const Storno = require("../models/storno.js")

function formatDate(date){
    var newDate = new Date(date)
    
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
    Firma.findAll({
        //TODO: da raboti
    }).then((result)=>{
        result.map((firma)=>{
            var date = new Date()
            var rok = new Date()
            rok.setDate(date.getDate()+10)
            Faktura.findOne({where:{
                mesec:03,
                godina:2021,
                firmaId:firma.id
            }}).then((postoeckafaktura)=>{
                if((postoeckafaktura===null)){
                    
                    Faktura.create({
                        brojNaFaktura:"05-2021",
                        mesec:03,
                        godina:2021,
                        datumNaIzdavanje: formatDate(date),
                        rokZaNaplata: formatDate(rok),
                        firmaId:firma.id
                    }).then((faktura)=>{
                        
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
                                        kolicinaOdSiteBroila=parseFloat(kolicinaOdSiteBroila)+parseFloat(broilo.vkupnoKolicina)
                                        kolicinaZelenaEnergija=parseFloat(kolicinaZelenaEnergija) + parseFloat(broilo.potrosenaZelenaEnergija)
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
                                        }}).then(()=>{
                                            Storno.findAll(
                                                {where: {firmaId:firma.id, tarifa: broilo.tarifa}
                                            }).then((stornoFirma) => {
                                                stornoFirma.map((stornoData)=>{
                                                    
                                                if(stornoData.vkupnoKolicina != 0){
                                                    if(stornoData.vkupnoKolicina >= promeni.elektricnaEnergija){
                                                        Storno.update({vkupnaKolicina: parseFloat(parseFloat(promeni.elektricnaEnergija)-parseFloat(stornoData.vkupnoKolicina))}, {where: {id: stornoData.firmaId}})
                                                    }
                                                    if(stornoData.vkupnoKolicina < promeni.elektricnaEnergija){
                                                        
                                                        StornoDisplay.create({
                                                            tarifa: stornoData.tarifa,
                                                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                                                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                                                            vkupnoKolicina: parseFloat(parseFloat(promeni.elektricnaEnergija)-parseFloat(stornoData.vkupnoKolicina)),
                                                            brojNaBroilo: stornoData.brojNaBroilo,
                                                            fakturaId: faktura.id
                                                        })
                                                        
                                                        Storno.update({vkupnaKolicina: parseFloat(0), pomireno: true}, {where: {firmaId: stornoData.firmaId, pomireno: false, tarifa: stornoData.tarifa, brojNaBroilo: stornoData.brojNaBroilo}})
                                                    }
                                                    
                                                }
                                                else{
                                                    
                                                    Storno.update({pomireno: true}, {where: {firmaId: stornoData.firmaId, pomireno: false, tarifa: stornoData.tarifa, brojNaBroilo: stornoData.brojNaBroilo}})
                                                }
                                            })
                                        })
                                        })
                                        Nagradi.create({
                                            agent:firma.agent,
                                            mesec,
                                            godina,
                                            suma:parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija).toFixed(2)*firma.nagrada,
                                            firma:firma.name
                                        })
                                        
                                    })
                                    
                                })
                                
                                
                            })
                        })
                    })
                }
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

function getDaysInMonth(m, y) {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}

const platiFaktura = async function(req, res){
    const fakturaid=req.body.fakturaid;
    const platena = req.body.platena;
    var den = req.body.den;
    var mesec = req.body.mesec;
    var godina = req.body.godina;

    if(fakturaid===undefined){
        return res.json({"error":"missing fakturaid","details":"supply fakturaid parameter"})
    }
    if(platena===undefined){
        return res.json({"error":"missing platena","details":"supply platena parameter"})
    }

    den = (den<1 || den>31) ? undefined : den
    mesec = (mesec<1 || mesec>12) ? undefined : mesec
    godina = (godina<2020 || godina>2100) ? undefined : godina
    
    if((den===undefined || mesec===undefined || godina===undefined) && platena){
        den = new Date().getDate()
        mesec = new Date().getMonth()+1
        godina = new Date().getFullYear()
    }
    
    const faktura = await Faktura.findOne({where:{
        id: fakturaid
    }})
    if (faktura.platena){
        return res.json({"error":"already paid","details":"this invoice has been paid already"})
    }
    
    const fakturaDen = faktura.rokZaNaplata.split("-")[0]
    const fakturaMesec = faktura.rokZaNaplata.split("-")[1]
    const fakturaGodina = faktura.rokZaNaplata.split("-")[2]


    // 20-1-2020
    // 3-2-2020

    //proveri dali mesecot i godinata se isti
    //ako ne se

    // for(let den1 = fakturaDen; den<getDaysInMonth(mesec, godina); den++){
    //     for(let mesec1 = fakturaMesec; mesec1 < )
    // }

}


module.exports={generirajFakturi, zemiFaktura, platiFaktura}