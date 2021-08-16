const ExcelJS = require('exceljs');
const Firma = require('../models/firma');
const Faktura = require("../models/faktura");
const BroiloStatus = require("../models/broiloStatus");
const MernaTocka = require('../models/mernaTocka');
const VkupnoPotrosena = require('../models/vkupnoPotrosena');
const StornoDisplay = require('../models/stornoDisplay');
const toPdf = async function(req,res){


}

const generirajBroiloTabela = async function(brojmernomesto,datumpocetok,datumkraj,brojbroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet, red){
    // broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo
    let cell
    let cell2

    for(let column=0;column<7;column++){
        for(let row=0;row<9;row++){
            cell= worksheet.getCell(String.fromCharCode("A".charCodeAt(0) + column)+(red+row))
            cell2 = worksheet.getCell(String.fromCharCode("A".charCodeAt(0) + column)+(58+row))
            cell.value=cell2.value
            cell.style=cell2.style
        }
    }
    
    try{
        for(let row=0;row<4;row++){
            worksheet.mergeCells('A'+(red+row)+':D'+(red+row));
            worksheet.mergeCells('E'+(red+row)+':K'+(red+row));
        }
    }catch(err){

    }


    cell= worksheet.getCell('E'+(red+0))
    cell.value=brojmernomesto

    cell= worksheet.getCell('E'+(red+1))
    cell.value=""

    cell= worksheet.getCell('E'+(red+2))
    cell.value=datumpocetok.replace("-",".").replace("-",".")+" - "+datumkraj.replace("-",".").replace("-",".")


    cell= worksheet.getCell('E'+(red+3))
    cell.value=brojbroilo

    cell= worksheet.getCell('B'+(red+5))
    cell.value=vtpocetna

    cell= worksheet.getCell('C'+(red+5))
    cell.value=vtkrajna

    cell= worksheet.getCell('D'+(red+5))
    cell.value=vtrazlika

    cell= worksheet.getCell('E'+(red+5))
    cell.value=vtmulti

    cell= worksheet.getCell('F'+(red+5))
    cell.value=vtkolicina


    cell= worksheet.getCell('B'+(red+6))
    cell.value=ntpocetna

    cell= worksheet.getCell('C'+(red+6))
    cell.value=ntkrajna

    cell= worksheet.getCell('D'+(red+6))
    cell.value=ntrazlika

    cell= worksheet.getCell('E'+(red+6))
    cell.value=ntmulti

    cell= worksheet.getCell('F'+(red+6))
    cell.value=ntkolicina





}

const toExcel = async function(req,res){
    const mesec = 3
    const godina = 2021
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("../test_data/510-2021 Komitent.xlsx");
    const worksheet = workbook.getWorksheet('Sheet1');
    
    
    const vkupno = await VkupnoPotrosena.findOne({where:{
        mesec, godina
    }})
    const faktura = await Faktura.findOne({where:
        {
            firmaId:1,
            mesec,
            godina
        },
        include: 
        {
            model: BroiloStatus,
            as: "Broilo"
        }
        
        })
    const firma = await Firma.findOne({where:{id:faktura.firmaId}})
    
    let cell = worksheet.getCell('B11');
    cell.value = firma.name;
    
    cell = worksheet.getCell("J16");
    cell.value = faktura.datumNaIzdavanje
   
    cell = worksheet.getCell("E16");
    cell.value = faktura.arhivskiBroj

    cell = worksheet.getCell("H20");
    cell.value = faktura.dataOd + " - " + faktura.dataDo

    cell = worksheet.getCell("J23");
    cell.value = faktura.elektricnaEnergija.toFixed(2)

    cell = worksheet.getCell("J24");
    cell.value = faktura.cenaKwhBezDDV.toFixed(2)

    cell = worksheet.getCell("J25");
    cell.value = parseFloat(faktura.vkupenIznosBezDDV).toFixed(2)

    cell = worksheet.getCell("J26");
    cell.value = faktura.obnovlivaEnergija.toFixed(2)

    cell = worksheet.getCell("J27");
    cell.value = faktura.cenaObnovlivaEnergija.toFixed(2)

    cell = worksheet.getCell("J28");
    cell.value = faktura.vkupnaObnovlivaEnergijaBezDDV.toFixed(2)

    cell = worksheet.getCell("J29");
    cell.value = faktura.nadomestZaOrganizacija

    cell = worksheet.getCell("B29");
    cell.value = "Надомест за организирање на пазарот на ел. енергија ("+faktura.nadomestZaOrganizacijaOdKwh + " мкд по kWh):"

    cell = worksheet.getCell("J30");
    cell.value = faktura.vkupenIznosBezDDV.toFixed(2)
    
    cell = worksheet.getCell("B32");
    cell.value = "ДДВ ("+vkupno.DDVProcent+"%):"


    cell = worksheet.getCell("J34");
    cell.value = faktura.vkupnaNaplata.toFixed(2)

    cell = worksheet.getCell("J36");
    cell.value = faktura.rokZaNaplata.replace("-",".").replace("-",".")
    var red=58
    const broila =await  BroiloStatus.findAll({where:{fakturaId:faktura.id, tarifa:"1.1.1.8.1.255"}})
    if(broila!==null){
        for(broilo of broila){
            let vtpocetna, vtkrajna, vtrazlika, vtmulti, vtkolicina
            let ntpocetna, ntkrajna, ntrazlika, ntmulti, ntkolicina
            let vkupno
            
            const istiBroila = await BroiloStatus.findAll({where:{fakturaId:faktura.id,brojBroilo:broilo.brojBroilo}})
            if(istiBroila!==null){
               
               for(istoBroilo of istiBroila){
                    if(istoBroilo.tarifa==="1.1.1.8.1.255"){
                        vtpocetna=istoBroilo.pocetnaSostojba
                        vtkrajna=istoBroilo.krajnaSostojba
                        vtrazlika=(parseFloat(vtkrajna)-parseFloat(vtpocetna)).toFixed(1)
                        vtmulti=istoBroilo.multiplikator
                        vtkolicina=istoBroilo.vkupnoKolicina
                    }else if(istoBroilo.tarifa==="1.1.1.8.2.255"){
                        ntpocetna=istoBroilo.pocetnaSostojba
                        ntkrajna=istoBroilo.krajnaSostojba
                        ntrazlika=(parseFloat(ntkrajna)-parseFloat(ntpocetna)).toFixed(1)
                        ntmulti=istoBroilo.multiplikator
                        ntkolicina=istoBroilo.vkupnoKolicina
                    }
                    vkupno=parseFloat(vtkolicina)+parseFloat(ntkolicina)
                    generirajBroiloTabela(broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
                }
            }
            red = red + 9
        }

    }

    const storni =await  StornoDisplay.findAll({where:{fakturaId:faktura.id, tarifa:"1.1.1.8.1.255"}})
    if(storni!==null){
        for(storno of storni){
            let vtpocetna, vtkrajna, vtrazlika, vtmulti, vtkolicina
            let ntpocetna, ntkrajna, ntrazlika, ntmulti, ntkolicina
            let vkupno
            
            const istiBroila = await BroiloStatus.findAll({where:{fakturaId:faktura.id,brojBroilo:broilo.brojBroilo}})
            if(istiBroila!==null){
               
               for(istoBroilo of istiBroila){
                    if(istoBroilo.tarifa==="1.1.1.8.1.255"){
                        vtpocetna=istoBroilo.pocetnaSostojba
                        vtkrajna=istoBroilo.krajnaSostojba
                        vtrazlika=(parseFloat(vtkrajna)-parseFloat(vtpocetna)).toFixed(1)
                        vtmulti=istoBroilo.multiplikator
                        vtkolicina=istoBroilo.vkupnoKolicina
                    }else if(istoBroilo.tarifa==="1.1.1.8.2.255"){
                        ntpocetna=istoBroilo.pocetnaSostojba
                        ntkrajna=istoBroilo.krajnaSostojba
                        ntrazlika=(parseFloat(ntkrajna)-parseFloat(ntpocetna)).toFixed(1)
                        ntmulti=istoBroilo.multiplikator
                        ntkolicina=istoBroilo.vkupnoKolicina
                    }
                    vkupno=parseFloat(vtkolicina)+parseFloat(ntkolicina)
                    generirajBroiloTabela(broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
                }
            }
            red = red + 9
        }

    }


        await workbook.xlsx.writeFile("../test_data/test.xlsx");
   
    
        

}


module.exports = {toExcel}