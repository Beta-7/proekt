const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")
const VkupnoPotrosena = require("../models/vkupnoPotrosena.js")
const MernaTocka = require("../models/mernaTocka.js")
const Nagradi = require("../models/nagradi.js")
const StornoDisplay = require("../models/stornoDisplay.js")
const Storno = require("../models/storno.js")
const Kamata = require("../models/kamata")
const generateLog = require("../logs.js")
const exportService = require("./exportService")
function formatDate(date){
    var newDate = new Date(date)
    
    return newDate.getDate() + "-" + parseInt(newDate.getMonth()+1) + "-" + newDate.getFullYear()
}


const generirajFakturi = async function(req,res){
    let godina = req.body.godina
    let mesec = req.body.mesec
    let vkupnoPotrosenaEnergija =0
    let date = new Date()
    let rok = new Date()
    rok.setDate(date.getDate()+10)

    let firmi = await Firma.findAll({})
    for(firma of firmi){
        let postoecka = await Faktura.findOne({where:{
            mesec,
            godina,
            firmaId:firma.id
        }})
        if(mesec<10){var tempmesec="0"+mesec}
        if(postoecka===null){
            
        let broilo = await BroiloStatus.findOne({where:{
            mesec: parseString(godina)+"."+parseString(tempmesec)+"-"+parseString(tempmesec) 
        }})    
            if(broilo!==null){

                let fakturaId = await Faktura.findOne({order: [
                    ['id', 'DESC'],
                ],})
                let faktura = await Faktura.create({
                    arhivskiBroj:(parseInt(fakturaId.id)+1)+"-"+godina,
                    mesec,
                    godina,
                    datumNaIzdavanje: formatDate(date),
                    rokZaNaplata: formatDate(rok),
                    firmaId:firma.id
                })
                
                
                let kamati = await Kamata.findAll({where:{
                    firmaid:firma.id,
                    fakturaDisplayId:null
                }})
                for(kamata of kamati){
                    await Kamata.update({
                        fakturaDisplayId:faktura.id
                    },{where:{id:kamata.id}})
                    await Faktura.update({kamataOdPrethodniFakturi:kamata.suma+faktura.kamataOdPrethodniFakturi},{where:{id:faktura.id}})
                }

                
                let broila = await firma.getBroilo({where:{
                    mesec:godina+"."+tempmesec+"-"+tempmesec
                }})
                let kolicinaOdSiteBroila=0
                for(broilo of broila){
                    await BroiloStatus.update({fakturaId:faktura.id},{where:{id:broilo.id}})
                    await faktura.addBroilo(broilo)
                    let MT = await MernaTocka.findOne({where:{tockaID:broilo.brojMernaTocka}})
                    kolicinaOdSiteBroila = kolicinaOdSiteBroila + broilo.vkupnoKolicina
                    await Faktura.update({
                        elektricnaEnergija:parseFloat(kolicinaOdSiteBroila).toFixed(2),
                        elektricnaEnergijaBezZelena:parseFloat(kolicinaOdSiteBroila).toFixed(2),
                        cenaKwhBezDDV:MT.cena,
                        dataOd:broilo.datumPocetok,
                        dataDo:broilo.datumKraj    
                    },{where:{
                        id:faktura.id
                    }})
                }
                await faktura.reload()
                let storni = await Storno.findAll({where:{
                    firmaId:firma.id
                }})
                for(stornoData of storni){
                    if(stornoData.vkupnoKolicina>0){
                        await StornoDisplay.create({
                            tarifa: stornoData.tarifa,
                            pocetnaSostojba:stornoData.pocetnaSostojba,
                            krajnaSostojba:stornoData.krajnaSostojba,
                            brojNaMernoMesto:stornoData.brojNaMernoMesto,
                            kolicina:stornoData.kolicina,
                            multiplikator:stornoData.multiplikator,
                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                            vkupnoKolicina: stornoData.vkupnoKolicina,
                            brojNaBroilo: stornoData.brojNaBroilo,
                            fakturaId: faktura.id,
                            firmaId:faktura.firmaId
                        })
                        await Storno.destroy({where:{id:stornoData.id}})
                    }
                    else if(stornoData.vkupnoKolicina < faktura.elektricnaEnergija){
                        await StornoDisplay.create({
                            tarifa: stornoData.tarifa,
                            pocetnaSostojba:stornoData.pocetnaSostojba,
                            krajnaSostojba:stornoData.krajnaSostojba,
                            kolicina:stornoData.kolicina,
                            multiplikator:stornoData.multiplikator,
                            brojNaMernoMesto:stornoData.brojNaMernoMesto,
                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                            vkupnoKolicina: stornoData.vkupnoKolicina,
                            brojNaBroilo: stornoData.brojNaBroilo,
                            fakturaId: faktura.id,
                            firmaId:faktura.firmaId
                        })
                        console.log(faktura.elektricnaEnergija+stornoData.vkupnoKolicina,faktura.id)
                        
                        await Faktura.update({
                            elektricnaEnergija:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                            elektricnaEnergijaBezZelena:faktura.elektricnaEnergija+stornoData.vkupnoKolicina
                        },{where:{
                            id:faktura.id
                        }})
                        await faktura.reload()
                        await Storno.destroy({where:{id:stornoData.id}})
                    }
                    else if(stornoData.vkupnoKolicina >= faktura.elektricnaEnergija){
                        await Faktura.update({elektricnaEnergija:0, elektricnaEnergijaBezZelena:0},{where:{
                            id:faktura.id
                        }})
                        await faktura.reload()
                        await StornoDisplay.create({
                            tarifa: stornoData.tarifa,
                            pocetnaSostojba:stornoData.pocetnaSostojba,
                            krajnaSostojba:stornoData.krajnaSostojba,
                            kolicina:stornoData.kolicina,
                            multiplikator:stornoData.multiplikator,
                            brojNaMernoMesto:stornoData.brojNaMernoMesto,
                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                            vkupnoKolicina: faktura.elektricnaEnergija,
                            brojNaBroilo: stornoData.brojNaBroilo,
                            fakturaId: faktura.id,
                            firmaId:faktura.firmaId
                        })
                        await Storno.update({
                            vkupnoKolicina:(parseFloat(stornoData.vkupnoKolicina)+parseFloat(faktura.elektricnaEnergija))*parseFloat(stornoData.multiplikator),
                            kolicina:(parseFloat(stornoData.vkupnoKolicina)+parseFloat(faktura.elektricnaEnergija))
                        },{where:{id:stornoData.id}})
                    }
                }
                
                
                var vkupnopotrosena = await VkupnoPotrosena.findOne({where:{
                    mesec,
                    godina
                }})
                var rezultatFaktura = await Faktura.findOne({where:{mesec, godina, firmaId:firma.id}})
                vkupnoPotrosenaEnergija = vkupnoPotrosenaEnergija + rezultatFaktura.elektricnaEnergijaBezZelena 
                await VkupnoPotrosena.update({vkupnoPotrosena:parseFloat(vkupnoPotrosenaEnergija)},{where:{id:vkupnopotrosena.id}})
                
            }
                
                
            }
            
        }
        return res.json({"status":"success"})
    }
    
const dodeliNagradi = async function(req, res){
    var mesec=req.body.mesec
    var godina=req.body.godina
    generateLog("Доделува награди",req.session.username,mesec+"-"+godina)
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
                            suma:parseInt(parseFloat(faktura.elektricnaEnergija).toFixed(2)*parseFloat(firma.nagrada)),
                            firma:firma.name
                        })
                    }else{
                        Nagradi.update({suma:parseInt(parseFloat(faktura.elektricnaEnergija).toFixed(2)*parseFloat(firma.nagrada))},{where:{id:postoecka.id}})
                    }
                })

            }).then(()=>{
                VkupnoPotrosena.findOne({where:{mesec, godina}}).then((vkupnoPotrosena)=>{
                    if(faktura.elektricnaEnergija===faktura.elektricnaEnergijaBezZelena){
                    var obnovlivaEnergija=parseFloat((faktura.elektricnaEnergijaBezZelena/vkupnoPotrosena.vkupnoPotrosena)*vkupnoPotrosena.zelenaKolicina).toFixed(2)
                    var elektricnaEnergija=(parseFloat(faktura.elektricnaEnergijaBezZelena)-parseFloat(obnovlivaEnergija)).toFixed(2)
                    var vkupnaObnovlivaEnergijaBezDDV = (vkupnoPotrosena.zelenaCena*obnovlivaEnergija).toFixed(2)
                    var vkupenIznosBezDDV = (faktura.cenaKwhBezDDV*elektricnaEnergija).toFixed(2)
                    var vkupenIznosNaFakturaBezDDV = parseFloat(vkupnaObnovlivaEnergijaBezDDV) + parseFloat(vkupenIznosBezDDV) + parseFloat(faktura.kamataOdPrethodniFakturi) + parseFloat((vkupnoPotrosena.nadomestZaOrganizacija*elektricnaEnergija))
                   
                    Faktura.update({
                        elektricnaEnergija,
                        obnovlivaEnergija,
                        cenaObnovlivaEnergija:vkupnoPotrosena.zelenaCena,
                        vkupnaObnovlivaEnergijaBezDDV,
                        vkupenIznosBezDDV,
                        nadomestZaOrganizacijaOdKwh:vkupnoPotrosena.nadomestZaOrganizacija,
                        nadomestZaOrganizacija: (vkupnoPotrosena.nadomestZaOrganizacija*elektricnaEnergija),
                        vkupenIznosNaFakturaBezDDV,
                        DDV:vkupnoPotrosena.DDVProcent,
                        vkupnaNaplata: vkupenIznosNaFakturaBezDDV + (vkupenIznosNaFakturaBezDDV * (vkupnoPotrosena.DDVProcent/100))

                    },{where:{id:faktura.id}})
                    }
            })

            })
            
        })
    })
    return res.json({"status":"success"})

}

const getFakturi = async function(req, res){
    let fakturi=null
    if(req.body.mesec===undefined || req.body.godina===undefined)
    fakturi = await Faktura.findAll({attributes:["id","arhivskiBroj", "mesec", "godina", "platena", "platenaNaDatum", "rokZaNaplata", "kamataOdPrethodniFakturi", "datumNaIzdavanje", "kamataZaKasnenje", "dataOd", "dataDo", "elektricnaEnergija", "elektricnaEnergijaBezZelena", "cenaKwhBezDDV", "vkupenIznosBezDDV", "obnovlivaEnergija", "cenaObnovlivaEnergija", "vkupnaObnovlivaEnergijaBezDDV", "nadomestZaOrganizacija", "nadomestZaOrganizacijaOdKwh", "vkupenIznosNaFakturaBezDDV", "DDV", "vkupnaNaplata"],raw : true})
    else{
    fakturi = await Faktura.findAll({where:{
        mesec:req.body.mesec,
        godina:req.body.godina
    },attributes:["id","arhivskiBroj", "mesec", "godina", "platena", "platenaNaDatum", "rokZaNaplata", "kamataOdPrethodniFakturi", "datumNaIzdavanje", "kamataZaKasnenje", "dataOd", "dataDo", "elektricnaEnergija", "elektricnaEnergijaBezZelena", "cenaKwhBezDDV", "vkupenIznosBezDDV", "obnovlivaEnergija", "cenaObnovlivaEnergija", "vkupnaObnovlivaEnergijaBezDDV", "nadomestZaOrganizacija", "nadomestZaOrganizacijaOdKwh", "vkupenIznosNaFakturaBezDDV", "DDV", "vkupnaNaplata"],raw : true})
     
    }
    return res.json(fakturi)
}

const zemiFaktura = async function(req, res){
    // Zemi red od tabelata i generiraj pdf/excel fajl
    console.log("asd")
    const izbor = req.body.izbor;
    const fakturaId = req.body.fakturaid;
    const faktura = await Faktura.findOne({where:{
        id:fakturaId
    }})
    let firma
    if(faktura!==null){
        firma = await Firma.findOne({where:{id:faktura.firmaId}})        
    }
    
    
    if(izbor !== "pdf" && izbor !== "excel"){
        return res.json({"message":"Invalid input","detail":"izbor must be pdf or excel"})
    }


    if(izbor === "excel"){
        exportService.toExcel(parseInt(fakturaId))
        res.sendFile("/fakturi/"+firma.name+"-"+faktura.arhivskiBroj+".xlsx",{"root":".."})
    }
        
    


}

function getDaysInMonth(m, y) {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}

const platiFaktura = async function(req, res){
    const fakturaid=req.body.id;
    const platena = req.body.platena;
    var datum = req.body.platenaNaDatum
    var den
    var mesec
    var godina
    if(!(datum === null) && datum.length > 11){
        den = datum[8]+datum[9]
        mesec = datum[5]+datum[6]
        godina = datum[0]+datum[1]+datum[2]+datum[3]
    }
    if(!(datum === null) && datum.length < 11){
        den = datum[0]+datum[1]
        mesec = datum[3]+datum[4]
        godina = datum[6]+datum[7]+datum[8]+datum[9]
    }
    
    if(fakturaid===undefined){
        return res.json({"error":"missing fakturaid","details":"supply fakturaid parameter"})
    }
    if(platena===undefined){
        return res.json({"error":"missing platena","details":"supply platena parameter"})
    }


    den = (den<1 || den>31) ? undefined : den
    mesec = (mesec<1 || mesec>12) ? undefined : mesec
    godina = (godina<2020 || godina>2100) ? undefined : godina
    
    if(datum === null && platena!==undefined){
        den = new Date().getDate()
        den = den > 9 ? "" + den: "0" + den;
        mesec = new Date().getMonth()+1
        mesec = mesec > 9 ? "" + mesec: "0" + mesec;
        godina = new Date().getFullYear()
        godina = godina > 9 ? "" + godina: "0" + godina;
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
            fakturaStoKasniId:faktura.id,
            fakturaDisplayId:null,
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
            fakturaStoKasniId:faktura.id
        }})
        Faktura.update({
            platena:false,
            platenaNaDatum:null
        },{where:{
            id:faktura.id
        }})
    }

    if(platena && faktura.platena){


            Faktura.update({
                platenaNaDatum:den+"-"+mesec+"-"+godina
            },{where:{
                id:faktura.id
            }})
        
    }


    return res.json({message:"Success",detail:"Updated data"})
}



module.exports={generirajFakturi, zemiFaktura, platiFaktura, dodeliNagradi, getFakturi}