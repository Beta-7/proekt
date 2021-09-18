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

var zip = new require('node-zip')();
var fs = require("fs")
var path=require("path")


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
    generateLog("Генерираше фактури за", req.session.username, mesec+"-"+godina)
    let firmi = await Firma.findAll({where:{}})
    for(firma of firmi){
        let postoecka = await Faktura.findOne({where:{
            mesec,
            godina,
            firmaId:firma.id
        }})
        if(mesec<10){var tempmesec="0"+mesec}
        if(postoecka===null){
        let temp = godina+"."+tempmesec+"-"+tempmesec
        let broilo = await BroiloStatus.findOne({where:{
            mesec: temp
        }})    
            if(broilo!==null){

                let fakturaId = await Faktura.findOne({order: [
                    ['id', 'DESC'],
                ],})
                
                let faktura = null;
                if(fakturaId===null){
                    faktura = await Faktura.create({
                        arhivskiBroj:"1-"+godina,
                        mesec,
                        godina,
                        datumNaIzdavanje: formatDate(date),
                        rokZaNaplata: formatDate(rok),
                        firmaId:firma.id
                    })
                }else{
                    faktura = await Faktura.create({
                        arhivskiBroj:(parseInt(fakturaId.id)+1)+"-"+godina,
                        mesec,
                        godina,
                        datumNaIzdavanje: formatDate(date),
                        rokZaNaplata: formatDate(rok),
                        firmaId:firma.id
                    })
                }
                
                
                
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
                let elektricnaEnergijaNT=0
                let elektricnaEnergijaVT=0
                for(broilo of broila){
                    let MTNT = await MernaTocka.findOne({where:{tockaID:broilo.brojMernaTocka, tarifa:"1.1.1.8.2.255"}})
                    let MTVT = await MernaTocka.findOne({where:{tockaID:broilo.brojMernaTocka, tarifa:"1.1.1.8.1.255"}})
                    
                    
                    //dokolku MT e null znaci deka ne se vneseni site merni tocki
                    if(MTNT!==null && MTNT.firmaId !==null && MTVT!==null && MTVT.firmaId !==null){
                    await BroiloStatus.update({fakturaId:faktura.id},{where:{id:broilo.id}})
                    await faktura.addBroilo(broilo)
                    kolicinaOdSiteBroila = kolicinaOdSiteBroila + broilo.vkupnoKolicina
                    if(broilo.tarifa==="1.1.1.8.2.255"){
                        elektricnaEnergijaNT = elektricnaEnergijaNT + broilo.vkupnoKolicina
                        //console.log("Niska tarifa:"+ elektricnaEnergijaNT +" "+ broilo.vkupnoKolicina)
                    }
                    if(broilo.tarifa==="1.1.1.8.1.255"){
                        elektricnaEnergijaVT = elektricnaEnergijaVT + broilo.vkupnoKolicina
                        //console.log("Visoka tarifa:"+ elektricnaEnergijaVT +" "+ broilo.vkupnoKolicina)
                    }
                    await Faktura.update({
                        elektricnaEnergija:parseFloat(kolicinaOdSiteBroila),
                        elektricnaEnergijaBezZelena:parseFloat(kolicinaOdSiteBroila),
                        elektricnaEnergijaNT:parseFloat(elektricnaEnergijaNT),
                        elektricnaEnergijaNTBezZelena:parseFloat(elektricnaEnergijaNT),
                        elektricnaEnergijaVT:parseFloat(elektricnaEnergijaVT),
                        elektricnaEnergijaVTBezZelena:parseFloat(elektricnaEnergijaVT),
                        cenaKwhBezDDVNT:MTNT.cena,
                        cenaKwhBezDDVVT:MTVT.cena,
                        dataOd:broilo.datumPocetok,
                        dataDo:broilo.datumKraj    
                    },{where:{
                        id:faktura.id
                    }})
                    await faktura.reload()
                }
            }
                let storni = await Storno.findAll({where:{
                    firmaId:firma.id
                }})
                for(stornoData of storni){
                    //niska tarifa
                    if(stornoData.tarifa === "1.1.1.8.2.255"){
                        await faktura.reload()
                        //stornoto dodava ekstra kolicina na fakturata. ne treba da se pravat proverki
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
                            await Faktura.update({
                                elektricnaEnergija:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                                elektricnaEnergijaBezZelena:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                                elektricnaEnergijaNT:faktura.elektricnaEnergijaNT+stornoData.vkupnoKolicina,
                                elektricnaEnergijaNTBezZelena:faktura.elektricnaEnergijaNT+stornoData.vkupnoKolicina,
                            },{where:{id:faktura.id}})
                            faktura.reload()
                        }
                        //ako stornoto ima poveke za odzemanje odkolku sto ima vo fakturata odzemi kolku sto mozes za vrednosta da e 0
                        else if((-1.00)*stornoData.vkupnoKolicina>faktura.elektricnaEnergijaNT && faktura.elektricnaEnergijaNT!=null){
                            let novaVrednostNaStorno =  stornoData.vkupnoKolicina + faktura.elektricnaEnergijaNT
                            await StornoDisplay.create({
                                tarifa: stornoData.tarifa,
                                pocetnaSostojba:stornoData.pocetnaSostojba,
                                krajnaSostojba:stornoData.krajnaSostojba,
                                brojNaMernoMesto:stornoData.brojNaMernoMesto,
                                kolicina:faktura.elektricnaEnergijaNT,
                                multiplikator:stornoData.multiplikator,
                                datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                                datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                                vkupnoKolicina: stornoData.vkupnoKolicina,
                                brojNaBroilo: stornoData.brojNaBroilo,
                                fakturaId: faktura.id,
                                firmaId:faktura.firmaId
                            })
                            await Storno.update({
                               vkupnoKolicina:novaVrednostNaStorno
                            },{where:{id:stornoData.id}})
                            await Faktura.update({
                                elektricnaEnergija:faktura.elektricnaEnergija-faktura.elektricnaEnergijaNT,
                                elektricnaEnergijaBezZelena:faktura.elektricnaEnergija-faktura.elektricnaEnergijaNT,
                                elektricnaEnergijaNT:0,
                                elektricnaEnergijaNTBezZelena:0,
                            },{where:{id:faktura.id}})
                            faktura.reload()
                        }
                        //ako stornoto e pomalo ili ednakvo na kolicinata moze celoto da se odzeme
                        else if((-1.00)*stornoData.vkupnoKolicina<=faktura.elektricnaEnergijaNT && faktura.elektricnaEnergijaNT!=null){
                            await StornoDisplay.create({
                                tarifa: stornoData.tarifa,
                                pocetnaSostojba:stornoData.pocetnaSostojba,
                                krajnaSostojba:stornoData.krajnaSostojba,
                                brojNaMernoMesto:stornoData.brojNaMernoMesto,
                                kolicina:stornoData.vkupnoKolicina,
                                multiplikator:stornoData.multiplikator,
                                datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                                datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                                vkupnoKolicina: stornoData.vkupnoKolicina,
                                brojNaBroilo: stornoData.brojNaBroilo,
                                fakturaId: faktura.id,
                                firmaId:faktura.firmaId
                            })
                            
                            await Faktura.update({
                                elektricnaEnergija:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                                elektricnaEnergijaBezZelena:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                                elektricnaEnergijaNT:faktura.elektricnaEnergijaNT+stornoData.vkupnoKolicina,
                                elektricnaEnergijaNTBezZelena:faktura.elektricnaEnergijaNT+stornoData.vkupnoKolicina,
                                
                            },{where:{id:faktura.id}})
                            await Storno.destroy({where:{id:stornoData.id}})
                            faktura.reload()
                        }
                }
                //visoka tarifa
                if(stornoData.tarifa === "1.1.1.8.1.255"){
                    //stornoto dodava ekstra kolicina na fakturata. ne treba da se pravat proverki
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

                        await Faktura.update({
                            elektricnaEnergija:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                            elektricnaEnergijaBezZelena:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                            elektricnaEnergijaVT:faktura.elektricnaEnergijaVT+stornoData.vkupnoKolicina,
                            elektricnaEnergijaVTBezZelena:faktura.elektricnaEnergijaVT+stornoData.vkupnoKolicina,
                        },{where:{id:faktura.id}})
                        faktura.reload()
                    }
                    //ako stornoto ima poveke za odzemanje odkolku sto ima vo fakturata odzemi kolku sto mozes za vrednosta da e 0
                    else if((-1.00)*stornoData.vkupnoKolicina>faktura.elektricnaEnergijaVT && faktura.elektricnaEnergijaVT!=null){
                        let novaVrednostNaStorno =  stornoData.vkupnoKolicina + faktura.elektricnaEnergijaVT
                        await StornoDisplay.create({
                            tarifa: stornoData.tarifa,
                            pocetnaSostojba:stornoData.pocetnaSostojba,
                            krajnaSostojba:stornoData.krajnaSostojba,
                            brojNaMernoMesto:stornoData.brojNaMernoMesto,
                            kolicina:faktura.elektricnaEnergijaVT,
                            multiplikator:stornoData.multiplikator,
                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                            vkupnoKolicina: stornoData.vkupnoKolicina,
                            brojNaBroilo: stornoData.brojNaBroilo,
                            fakturaId: faktura.id,
                            firmaId:faktura.firmaId
                        })
                        await Storno.update({
                           vkupnoKolicina:novaVrednostNaStorno
                        },{where:{id:stornoData.id}})
                        await Faktura.update({
                            elektricnaEnergija:faktura.elektricnaEnergija-faktura.elektricnaEnergijaVT,
                            elektricnaEnergijaBezZelena:faktura.elektricnaEnergija-faktura.elektricnaEnergijaVT,
                            elektricnaEnergijaVT:0,
                            elektricnaEnergijaVTBezZelena:0,
                        },{where:{id:faktura.id}})
                        faktura.reload()
                    }
                    //ako stornoto e pomalo ili ednakvo na kolicinata moze celoto da se odzeme
                    else if((-1.00)*stornoData.vkupnoKolicina<=faktura.elektricnaEnergijaVT && faktura.elektricnaEnergijaVT!=null){
                        await StornoDisplay.create({
                            tarifa: stornoData.tarifa,
                            pocetnaSostojba:stornoData.pocetnaSostojba,
                            krajnaSostojba:stornoData.krajnaSostojba,
                            brojNaMernoMesto:stornoData.brojNaMernoMesto,
                            kolicina:stornoData.vkupnoKolicina,
                            multiplikator:stornoData.multiplikator,
                            datumNaPocetokNaMerenje: stornoData.datumNaPocetokNaMerenje,
                            datumNaZavrshuvanjeNaMerenje: stornoData.datumNaZavrshuvanjeNaMerenje,
                            vkupnoKolicina: stornoData.vkupnoKolicina,
                            brojNaBroilo: stornoData.brojNaBroilo,
                            fakturaId: faktura.id,
                            firmaId:faktura.firmaId
                        })
                        await Faktura.update({
                            elektricnaEnergija:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                            elektricnaEnergijaBezZelena:faktura.elektricnaEnergija+stornoData.vkupnoKolicina,
                            elektricnaEnergijaVT:faktura.elektricnaEnergijaVT+stornoData.vkupnoKolicina,
                            elektricnaEnergijaVTBezZelena:faktura.elektricnaEnergijaVT+stornoData.vkupnoKolicina,
                            
                        },{where:{id:faktura.id}})
                        await Storno.destroy({where:{id:stornoData.id}})
                        faktura.reload()
                    }
            }
                
                
                
                
            }
                
                
            }
            
        }

        
        var rezultatFaktura = await Faktura.findOne({where:{mesec, godina, firmaId:firma.id}})
        vkupnoPotrosenaEnergija = vkupnoPotrosenaEnergija + rezultatFaktura.elektricnaEnergijaBezZelena 
        
    }
    var vkupnopotrosena = await VkupnoPotrosena.findOne({where:{
        mesec,
        godina
    }})
    await VkupnoPotrosena.update({vkupnoPotrosena:parseFloat(vkupnoPotrosenaEnergija)},{where:{id:vkupnopotrosena.id}})
    await dodeliNagradi(mesec, godina)

    return res.json({"status":"success"})
}
    
const dodeliNagradi = async function(mesec, godina){
    // generateLog("Доделува награди",req.session.username,mesec+"-"+godina)


    //pomini gi site fakturi i dodeli nagradi na agenti bazirano na kolku elektricna energija imaat potroseno
    const fakturi = await Faktura.findAll({where:{
        mesec, godina
    }})
    const vkupnoPotrosena = await VkupnoPotrosena.findOne({where:{mesec, godina}})
    for(faktura of fakturi){
        const firma = await Firma.findOne({where:{id:faktura.firmaId}})
        const postoeckaNagrada = await Nagradi.findOne({where:{
            agent:firma.agent,
            mesec,
            godina,
            firma:firma.name
        }}) 
        if(faktura.elektricnaEnergijaBezZelena>0 && faktura.agent!==null){
            if(postoeckaNagrada===null){
                await Nagradi.create({
                    agent:firma.agent,
                    mesec,
                    godina,
                    suma:parseInt(parseFloat(faktura.elektricnaEnergija)*parseFloat(firma.nagrada)),
                    firma:firma.name
                })
            }
        }
    

    //dodeli zelena energija i presmetaj gi site polinja
    
    if (vkupnoPotrosena!==null){
        if(faktura.elektricnaEnergija===faktura.elektricnaEnergijaBezZelena){
            const MTNT = await MernaTocka.findOne({where:{
                tarifa:"1.1.1.8.2.255",
                firmaId:faktura.firmaId
            }})
            const MTVT = await MernaTocka.findOne({where:{
                tarifa:"1.1.1.8.1.255",
                firmaId:faktura.firmaId
            }})
            if(MTNT!==null && MTVT!==null){

            
            var obnovlivaEnergija=parseFloat((faktura.elektricnaEnergijaBezZelena/vkupnoPotrosena.vkupnoPotrosena)*vkupnoPotrosena.zelenaKolicina)
            var elektricnaEnergija=(parseFloat(faktura.elektricnaEnergijaBezZelena)-parseFloat(obnovlivaEnergija))
            var procentZelenaNT = parseFloat(faktura.elektricnaEnergijaNTBezZelena)/parseFloat(faktura.elektricnaEnergijaBezZelena)
            var procentZelenaVT = parseFloat(faktura.elektricnaEnergijaVTBezZelena)/parseFloat(faktura.elektricnaEnergijaBezZelena)
            var elektricnaEnergijaNT=(parseFloat(faktura.elektricnaEnergijaNTBezZelena)-parseFloat(obnovlivaEnergija)*procentZelenaNT)
            var elektricnaEnergijaVT=(parseFloat(faktura.elektricnaEnergijaVTBezZelena)-parseFloat(obnovlivaEnergija)*procentZelenaVT)
            var vkupnaObnovlivaEnergijaBezDDV = (vkupnoPotrosena.zelenaCena*obnovlivaEnergija)

            var vkupenIznosBezDDV = (parseFloat(elektricnaEnergijaNT * MTNT.cena)+parseFloat(elektricnaEnergijaVT * MTVT.cena))
            var vkupenIznosNaFakturaBezDDV = parseFloat(vkupnaObnovlivaEnergijaBezDDV) + parseFloat(vkupenIznosBezDDV) + parseFloat(faktura.kamataOdPrethodniFakturi) + parseFloat((vkupnoPotrosena.nadomestZaOrganizacija*faktura.elektricnaEnergijaBezZelena))
           await Faktura.update({
                elektricnaEnergija,
                obnovlivaEnergija,
                elektricnaEnergijaNT,
                elektricnaEnergijaVT,
                cenaObnovlivaEnergija:vkupnoPotrosena.zelenaCena,
                vkupnaObnovlivaEnergijaBezDDV,
                vkupenIznosBezDDV,
                nadomestZaOrganizacijaOdKwh:vkupnoPotrosena.nadomestZaOrganizacija,
                nadomestZaOrganizacija: (vkupnoPotrosena.nadomestZaOrganizacija*faktura.elektricnaEnergijaBezZelena),
                vkupenIznosNaFakturaBezDDV,
                DDV:vkupnoPotrosena.DDVProcent,
                vkupnaNaplata: vkupenIznosNaFakturaBezDDV + (vkupenIznosNaFakturaBezDDV * (vkupnoPotrosena.DDVProcent/100))

            },{where:{id:faktura.id}})
            }
        }
    }
    await faktura.reload()
    if(faktura.vkupnaNaplata==0 || faktura.vkupnaNaplata==null){
    generateLog("Бришам празна фактура за",actor="SYSTEM", faktura.firmaId)
    await Faktura.destroy({where:{id:faktura.id}})

    }
}

}

const getFakturi = async function(req, res){
    let fakturi=null
    if(req.body.mesec===undefined || req.body.godina===undefined)
    fakturi = await Faktura.findAll({attributes:["id","arhivskiBroj", "mesec", "godina", "platena", "platenaNaDatum", "rokZaNaplata", "kamataOdPrethodniFakturi", "datumNaIzdavanje", "kamataZaKasnenje", "dataOd", "dataDo", "elektricnaEnergija", "elektricnaEnergijaBezZelena", "cenaKwhBezDDVNT", "cenaKwhBezDDVVT", "vkupenIznosBezDDV", "obnovlivaEnergija", "cenaObnovlivaEnergija", "vkupnaObnovlivaEnergijaBezDDV", "nadomestZaOrganizacija", "nadomestZaOrganizacijaOdKwh", "vkupenIznosNaFakturaBezDDV", "DDV", "vkupnaNaplata"],raw : true})
    else{
    fakturi = await Faktura.findAll({where:{
        mesec:req.body.mesec,
        godina:req.body.godina
    },attributes:["id","arhivskiBroj", "mesec", "godina", "platena", "platenaNaDatum", "rokZaNaplata", "kamataOdPrethodniFakturi", "datumNaIzdavanje", "kamataZaKasnenje", "dataOd", "dataDo", "elektricnaEnergija", "elektricnaEnergijaBezZelena", "cenaKwhBezDDVNT", "cenaKwhBezDDVVT", "vkupenIznosBezDDV", "obnovlivaEnergija", "cenaObnovlivaEnergija", "vkupnaObnovlivaEnergijaBezDDV", "nadomestZaOrganizacija", "nadomestZaOrganizacijaOdKwh", "vkupenIznosNaFakturaBezDDV", "DDV", "vkupnaNaplata"],raw : true})
     
    }
    return res.json(fakturi)
}

const zemiFaktura = async function(req, res){
    // Zemi red od tabelata i generiraj pdf/excel fajl
    const izbor = req.query.izbor;
    const fakturaId = req.query.fakturaid;
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

    let filename = firma.name+"-"+faktura.arhivskiBroj+".xlsx"
    if(izbor === "excel"){
        await exportService.toExcel(parseInt(fakturaId))
        res.attachment(filename)
        res.sendFile("/fakturi/"+filename,{"root":".."})

    }
        

}
const zemiFakturiMesec = async function(req,res){
    const mesec=parseInt(req.query.mesec)
    const godina=parseInt(req.query.godina)
    let imeFakturi = []
    let fakturibr = 0
    

    const fakturi = await Faktura.findAll({where:{
        mesec, godina
    }})
    for(faktura of fakturi){
        if(faktura.vkupnaNaplata>0){
            const firma = await Firma.findOne({where:{id:faktura.firmaId}})
            await exportService.toExcel(faktura.id)
            fakturibr = fakturibr +1
            imeFakturi.push("../fakturi/"+firma.name+"-"+faktura.arhivskiBroj+".xlsx")
            zip.file(firma.name+"-"+faktura.arhivskiBroj+".xlsx", fs.readFileSync(path.join(__dirname, "/../"+imeFakturi[0])));

        }
    }
    if(fakturibr==0){return}
    var data = zip.generate({ base64:false, compression: 'DEFLATE' });
    fs.writeFileSync("../mesecni/"+mesec+"-"+godina+'.zip', data, 'binary');
    res.attachment("../mesecni/"+mesec+"-"+godina+'.zip')
    res.sendFile("mesecni/"+mesec+"-"+godina+'.zip',{"root":".."})
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
            arhivskiBroj:faktura.arhivskiBroj,
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



module.exports={generirajFakturi, zemiFaktura, platiFaktura, dodeliNagradi, getFakturi, zemiFakturiMesec}