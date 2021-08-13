const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")
const VkupnoPotrosena = require("../models/vkupnoPotrosena.js")
const MernaTocka = require("../models/mernaTocka.js")
const Nagradi = require("../models/nagradi.js")
const StornoDisplay = require("../models/stornoDisplay.js")
const Storno = require("../models/storno.js")
const Kamata = require("../models/kamata")

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
    godina=2021
    mesec=3
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
                if((postoeckafaktura===null||true)){
                    
                    Faktura.create({
                        arhivskiBroj:"05-2021",
                        mesec:3,
                        godina:2021,
                        datumNaIzdavanje: formatDate(date),
                        rokZaNaplata: formatDate(rok),
                        firmaId:firma.id
                    }).then((faktura)=>{
                        if(mesec<10){
                           var tempmesec="0"+mesec
                        }
                        firma.getBroilo({
                            where:{
                                mesec:godina+"."+tempmesec+"-"+tempmesec
                            }
                        }).then((result)=>{
                            var kolicinaOdSiteBroila=0
                            var kolicinaZelenaEnergija=0
                            var promeni = {}
                            result.map((broilo)=>{
                                
                                BroiloStatus.update({fakturaId:faktura.id},{where:{id:broilo.id}})
                                MernaTocka.findOne({where:{
                                    tockaID:broilo.brojMernaTocka,
                                    tarifa:broilo.tarifa
                                }}).then((mernaTocka)=>{
                                    VkupnoPotrosena.findOne({where:{
                                        mesec,
                                        godina
                                    }}).then((vkupnoPotrosena)=>{
                                        kolicinaOdSiteBroila=parseFloat(kolicinaOdSiteBroila)+parseFloat(broilo.vkupnoKolicina)
                                        console.log(broilo.vkupnoKolicina)
                                        kolicinaZelenaEnergija=parseFloat(kolicinaZelenaEnergija) + parseFloat(broilo.potrosenaZelenaEnergija)
                                        faktura.addBroilo(broilo)
                                        
                                        promeni={
                                            elektricnaEnergija:parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija).toFixed(2),
                                            elektricnaEnergijaBezStorno:parseFloat(kolicinaOdSiteBroila-kolicinaZelenaEnergija).toFixed(2),
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
                                        console.log(kolicinaOdSiteBroila, kolicinaZelenaEnergija)
                                        Faktura.update(promeni,{where:{
                                            id:faktura.id
                                        }}).then(()=>{
                                            
                                            Storno.findAll(
                                                {where: {firmaId:firma.id, tarifa: broilo.tarifa}
                                            }).then((stornoFirma) => {
                                                stornoFirma.map((stornoData)=>{
                                                    
                                                    
                                                    if(stornoData.vkupnoKolicina < promeni.elektricnaEnergija){
                                                        StornoDisplay.create({
                                                            tarifa: stornoData.tarifa,
                                                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                                                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                                                            vkupnoKolicina: stornoData.vkupnoKolicina,
                                                            brojNaBroilo: stornoData.brojNaBroilo,
                                                            fakturaId: faktura.id
                                                        })
                                                        Faktura.update({elektricnaEnergija:promeni.elektricnaEnergija-stornoData.vkupnoKolicina},{where:{
                                                            id:faktura.id
                                                        }})
                                                        Storno.destroy({where:{id:stornoData.id}})
                                                    }
                                                    if(stornoData.vkupnoKolicina >= promeni.elektricnaEnergija){
                                                        Faktura.update({elektricnaEnergija:0},{where:{
                                                            id:faktura.id
                                                        }})
                                                        StornoDisplay.create({
                                                            tarifa: stornoData.tarifa,
                                                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                                                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                                                            vkupnoKolicina: promeni.elektricnaEnergija,
                                                            brojNaBroilo: stornoData.brojNaBroilo,
                                                            fakturaId: faktura.id
                                                        })
                                                        Storno.update({
                                                            vkupnoKolicina:(parseFloat(stornoData.vkupnoKolicina)-parseFloat(promeni.elektricnaEnergija))*parseFloat(stornoData.multiplikator),
                                                            kolicina:(parseFloat(stornoData.vkupnoKolicina)-parseFloat(promeni.elektricnaEnergija))
                                                        },{where:{id:stornoData.id}})
                                                    }
                                                    
                                                
                                            })
                                        })
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
    console.log("asd")
    dodeliNagradi(mesec, godina)
    return 
}

const dodeliNagradi = function(mesec, godina){
    Faktura.findAll({
        where:{
            mesec, godina
        }
    }).then((fakturi)=>{
        fakturi.map((faktura)=>{
            Firma.findOne({where:{id:faktura.firmaId}}).then((firma)=>{
                Nagradi.findOne({where:{
                    agent:firma.agent,
                    mesec,
                    godina,
                    firma:firma.name
                }}).then((postoecka)=>{
                    if(postoecka===null){
                        Nagradi.create({
                            agent:firma.agent,
                            mesec,
                            godina,
                            suma:parseInt(parseFloat(faktura.elektricnaEnergijaBezStorno).toFixed(2)*parseFloat(firma.nagrada)),
                            firma:firma.name
                        })
                    }
                })

            })
            
        })
    })
    
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
    include: 
    {
        model: BroiloStatus,
        as: "Broilo"
    }
    
    }).then((result)=>{
        console.log("Faktura so id "+result.id + " za kompanijata "+result.firmaId)
        result.Broilo.map((broilo)=>{
            console.log("Broilo " + broilo.id)
        })
        StornoDisplay.findAll({where:{
            
        }})
        result.Storno.map((storno)=>{
            console.log("Storno " + storno.id)
        })
        result.Storno.map((kamata)=>{
            console.log("Kamata " + kamata.id)
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
    
    if((den===undefined || mesec===undefined || godina===undefined) && platena!==undefined){
        den = new Date().getDate()
        mesec = new Date().getMonth()+1
        godina = new Date().getFullYear()
    }
    
    const faktura = await Faktura.findOne({where:{
        id: fakturaid
    }})
    
    if(faktura===null){
        return res.json({"error":"wrong id","details":"faktura doesn't exist"})
    }

    const vkupnoPotrosena = await VkupnoPotrosena.findOne({where:{
        mesec:faktura.mesec,
        godina:faktura.godina
    }})
    if(vkupnoPotrosena===null){
        return res.json({"error":"no monthly data","details":"can't find fee values"})
    }

    var [denFaktura,mesecFaktura,godinaFaktura] = faktura.rokZaNaplata.split("-")

    var fakturaDate = new Date(Date.UTC(godinaFaktura,mesecFaktura-1,denFaktura))
    var platenaDate = new Date(Date.UTC(godina, mesec-1, den))
    
    
    //Fakturata se plaka
    if(platena && !faktura.platena){
    //Fakturata e platena odkako istekol rokot
    if(fakturaDate <= platenaDate)
    {
        var denoviZakasneto = (platenaDate.getTime()-fakturaDate.getTime()) / (1000 * 3600 * 24)

        Kamata.create({
            firmaid:faktura.firmaId,
            fakturaid:faktura.id,
            suma:(faktura.vkupnaNaplata * (vkupnoPotrosena.kamatnaStapka/100) * denoviZakasneto),
            rok:faktura.rokZaNaplata,
            platenoData:den+"-"+mesec+"-"+godina
        })
    }
    Faktura.update({
        platena:true,
        platenaNaDatum:den+"-"+mesec+"-"+godina
    },{where:{
        id:faktura.id
    }})
    }

    //Greska, fakturata ne bila platena. Vragi go platena statusot na false i izbrisi ja kamatata.
    // Sleden pat koga ke se plati ke bide generirana
    if(!platena && faktura.platena){
        Kamata.destroy({where:{
            fakturaid:faktura.id
        }})
        Faktura.update({
            platena:false,
            platenaNaDatum:null
        },{where:{
            id:faktura.id
        }})
    }

}


module.exports={generirajFakturi, zemiFaktura, platiFaktura}