const ExcelJS = require('exceljs');
const Firma = require('../models/firma');
const Faktura = require("../models/faktura");
const BroiloStatus = require("../models/broiloStatus");

const VkupnoPotrosena = require('../models/vkupnoPotrosena');
const StornoDisplay = require('../models/stornoDisplay');
const Kamata = require("../models/kamata");
const MernaTocka = require('../models/mernaTocka');
const toPdf = async function(req,res){


}

const generirajBroiloTabela = async function(adresa,brojmernomesto,datumpocetok,datumkraj,brojbroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet, red){
    // broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo
    let cell
    let cell2

    for(let column=0;column<7;column++){
        for(let row=0;row<9;row++){
            cell= worksheet.getCell(String.fromCharCode("A".charCodeAt(0) + column)+(red+row))
            cell2 = worksheet.getCell(String.fromCharCode("A".charCodeAt(0) + column)+(55+row))
            cell.value=cell2.value
            cell.style=cell2.style
        }
    }
    
    try{
        for(let row=0;row<4;row++){
            worksheet.mergeCells('B'+(red+row)+':E'+(red+row));
            worksheet.mergeCells('F'+(red+row)+':H'+(red+row));
        }
    }catch(err){

    }


    worksheet.getCell('F'+(red+0)).value=brojmernomesto


    worksheet.getCell('F'+(red+1)).value=adresa

    worksheet.getCell('F'+(red+2)).value=datumpocetok.replace("-",".").replace("-",".")+" - "+datumkraj.replace("-",".").replace("-",".")


    worksheet.getCell('F'+(red+3)).value=brojbroilo

    cell= worksheet.getCell('C'+(red+5))
    cell.value=vtpocetna

    cell= worksheet.getCell('D'+(red+5))
    cell.value=vtkrajna

    cell= worksheet.getCell('E'+(red+5))
    cell.value=parseFloat(vtrazlika).toFixed(3)

    cell= worksheet.getCell('F'+(red+5))
    cell.value=vtmulti
    
    cell= worksheet.getCell('G'+(red+5))
    cell.value=parseFloat(vtkolicina).toFixed(3)


    cell= worksheet.getCell('C'+(red+6))
    cell.value=ntpocetna

    cell= worksheet.getCell('D'+(red+6))
    cell.value=ntkrajna

    cell= worksheet.getCell('E'+(red+6))
    cell.value=parseFloat(ntrazlika).toFixed(3)

    cell= worksheet.getCell('F'+(red+6))
    cell.value=ntmulti

    cell= worksheet.getCell('G'+(red+6))
    cell.value=parseFloat(ntkolicina).toFixed(3)

    cell= worksheet.getCell('G'+(red+7))
    let kolicina = parseFloat(vtkolicina+ntkolicina).toFixed(3)
    if(vtkolicina===undefined){
        kolicina = parseFloat(ntkolicina).toFixed(3)
    }
    if(ntkolicina===undefined){
        kolicina = parseFloat(vtkolicina).toFixed(3)
    }

    cell.value=kolicina


return worksheet

}

const toExcel = async function(fakturaId){
    let workbook = new ExcelJS.Workbook();
    try{
        await workbook.xlsx.readFile("../template.xlsx");
    } catch(e){
        return
    }
    let worksheet = workbook.getWorksheet('Sheet1');
    
    const faktura = await Faktura.findOne({where:
        {
            id:fakturaId
        },
        include: 
        {
            model: BroiloStatus,
            as: "Broilo"
        }
        
    })
    if(faktura===null){
        return 
    }
    const vkupno = await VkupnoPotrosena.findOne({where:{
        mesec:faktura.mesec,
        godina:faktura.godina
    }})
    const firma = await Firma.findOne({where:{id:faktura.firmaId}})
    const MTVT = await MernaTocka.findOne({where:{firmaId:firma.id, tarifa:"1.1.1.8.1.255"}})
    const MTNT = await MernaTocka.findOne({where:{firmaId:firma.id, tarifa:"1.1.1.8.2.255"}})

    worksheet.getCell('B8').value = firma.name;
    worksheet.getCell("B10").value = firma.adresaNaFirma
    worksheet.getCell("J13").value = faktura.datumNaIzdavanje
    worksheet.getCell("E13").value = faktura.arhivskiBroj
    worksheet.getCell("H17").value = faktura.dataOd + " - " + faktura.dataDo
    
    worksheet.getCell("J20").value = faktura.elektricnaEnergijaVT
    worksheet.getCell("B21").value = "Вкупен износ без ДДВ за ел. енергија ВТ  ("+parseFloat(MTVT.cena).toFixed(2)+" ден/kWh)"    
    worksheet.getCell("J21").value = parseFloat(faktura.elektricnaEnergijaVT) * parseFloat(MTVT.cena)
    
    worksheet.getCell("J22").value = faktura.elektricnaEnergijaNT
    worksheet.getCell("B23").value = "Вкупен износ без ДДВ за ел. енергија НТ  ("+parseFloat(MTNT.cena).toFixed(2)+" ден/kWh)"    
    worksheet.getCell("J23").value = parseFloat(faktura.elektricnaEnergijaNT) * parseFloat(MTNT.cena)
    
    worksheet.getCell("J24").value = faktura.obnovlivaEnergija.toFixed(4)
    worksheet.getCell("J25").value = faktura.cenaObnovlivaEnergija
    worksheet.getCell("J26").value = faktura.vkupnaObnovlivaEnergijaBezDDV
    
    worksheet.getCell("B27").value = "Надомест за организирање на пазарот на ел. енергија ("+faktura.nadomestZaOrganizacijaOdKwh + " мкд по kWh):"
    worksheet.getCell("J27").value = faktura.nadomestZaOrganizacija
    
    worksheet.getCell("J28").value = faktura.vkupenIznosNaFakturaBezDDV
    
    worksheet.getCell("B29").value = "ДДВ ("+vkupno.DDVProcent+"%):"
    
    worksheet.getCell("J29").value = (faktura.vkupenIznosNaFakturaBezDDV * (vkupno.DDVProcent/100.0))
    
    
    worksheet.getCell("J31").value = faktura.vkupnaNaplata
    worksheet.getCell("J33").value = faktura.rokZaNaplata.replace("-",".").replace("-",".")
    
    
    
    var red=55
    const broila =await  BroiloStatus.findAll({where:{fakturaId:faktura.id, tarifa:"1.1.1.8.1.255"}})
    if(broila!==null){
        for(broilo of broila){
            let vtpocetna, vtkrajna, vtrazlika, vtmulti, vtkolicina
            let ntpocetna, ntkrajna, ntrazlika, ntmulti, ntkolicina

            const istiBroila = await BroiloStatus.findAll({where:{fakturaId:faktura.id,brojBroilo:broilo.brojBroilo}})
            if(istiBroila!==null){
               
               for(istoBroilo of istiBroila){
                    if(istoBroilo.tarifa==="1.1.1.8.1.255"){
                        vtpocetna=istoBroilo.pocetnaSostojba
                        vtkrajna=istoBroilo.krajnaSostojba
                        vtrazlika=(parseFloat(vtkrajna)-parseFloat(vtpocetna))
                        vtmulti=istoBroilo.multiplikator
                        vtkolicina=istoBroilo.vkupnoKolicina
                    }else if(istoBroilo.tarifa==="1.1.1.8.2.255"){
                        ntpocetna=istoBroilo.pocetnaSostojba
                        ntkrajna=istoBroilo.krajnaSostojba
                        ntrazlika=(parseFloat(ntkrajna)-parseFloat(ntpocetna))
                        ntmulti=istoBroilo.multiplikator
                        ntkolicina=istoBroilo.vkupnoKolicina
                    }
                    await generirajBroiloTabela(firma.adresaNaFirma,broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
                }
            }
            red = red + 9
        }

    }

    const storni =await  StornoDisplay.findAll({where:{fakturaId:faktura.id}, distinct: 'tarifa'})
    if(storni!==null){
        for(storno of storni){
            let vtpocetna, vtkrajna, vtrazlika, vtmulti, vtkolicina
            let ntpocetna, ntkrajna, ntrazlika, ntmulti, ntkolicina

            const istiStorni = await StornoDisplay.findAll({where:{fakturaId:faktura.id,brojNaBroilo:storno.brojNaBroilo}})
            if(istiStorni!==null){
               
               for(istoStorno of istiStorni){
                    if(istoStorno.tarifa==="1.1.1.8.1.255"){
                        vtpocetna=istoStorno.pocetnaSostojba
                        vtkrajna=istoStorno.krajnaSostojba
                        vtrazlika=(parseFloat(vtkrajna)-parseFloat(vtpocetna))
                        vtmulti=istoStorno.multiplikator
                        vtkolicina=istoStorno.vkupnoKolicina
                    }else if(istoStorno.tarifa==="1.1.1.8.2.255"){
                        ntpocetna=istoStorno.pocetnaSostojba
                        ntkrajna=istoStorno.krajnaSostojba
                        ntrazlika=(parseFloat(ntkrajna)-parseFloat(ntpocetna))
                        ntmulti=istoStorno.multiplikator
                        ntkolicina=istoStorno.vkupnoKolicina
                    }
                    await generirajBroiloTabela(firma.adresaNaFirma,istoStorno.brojNaMernoMesto,istoStorno.datumNaPocetokNaMerenje,istoStorno.datumNaZavrshuvanjeNaMerenje,istoStorno.brojNaBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
                }
            }
            red = red + 9
        }

    }
    const kamati =await  Kamata.findAll({where:{fakturaDisplayId:faktura.id}})
    let kamatarow=30
    for(kamata of kamati){
        worksheet.insertRow(kamatarow);
        
        for(let a=0;a<5;a++){
            let cell1 = worksheet.getCell(String.fromCharCode("B".charCodeAt(0) + a)+kamatarow)
            let cell2 = worksheet.getCell(String.fromCharCode("B".charCodeAt(0) + a)+(kamatarow-2))

            cell1.value=cell2.value
            cell1.style=cell2.style
        }
        try{worksheet.mergeCells('B'+(kamatarow)+':I'+(kamatarow));} catch(e){}
        worksheet.getCell("B"+kamatarow).value = "Казнена камата за фактура " + kamata.arhivskiBroj
        worksheet.getCell("J"+kamatarow).value = parseInt(kamata.suma)
        worksheet.getCell("K"+kamatarow).value = "ден."
        kamatarow=kamatarow+1

    }




    await workbook.xlsx.writeFile("../fakturi/"+firma.name+"-"+faktura.arhivskiBroj+".xlsx");
    

}


module.exports = {toExcel}