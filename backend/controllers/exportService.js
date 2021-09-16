const ExcelJS = require('exceljs');
const Firma = require('../models/firma');
const Faktura = require("../models/faktura");
const BroiloStatus = require("../models/broiloStatus");

const VkupnoPotrosena = require('../models/vkupnoPotrosena');
const StornoDisplay = require('../models/stornoDisplay');
const Kamata = require("../models/kamata")
const toPdf = async function(req,res){


}

const generirajBroiloTabela = async function(adresa,brojmernomesto,datumpocetok,datumkraj,brojbroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet, red){
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
            worksheet.mergeCells('E'+(red+row)+':G'+(red+row));
        }
    }catch(err){

    }


    cell= worksheet.getCell('E'+(red+0))

    cell.value=brojmernomesto


    cell= worksheet.getCell('E'+(red+1))
    cell.value=adresa

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

    cell= worksheet.getCell('F'+(red+7))
    cell.value=vtkolicina+ntkolicina


return worksheet

}

const toExcel = async function(req, res){
    const fakturaId = req.body.fakturaId
    let workbook = new ExcelJS.Workbook();
    try{
        await workbook.xlsx.readFile("../template.xlsx");
    } catch(e){
        console.log(e)
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
    
    let cell = worksheet.getCell('B11');
    cell.value = firma.name;
    
    cell = worksheet.getCell("B13")
    cell.value = firma.adresaNaFirma

    cell = worksheet.getCell("J16");
    cell.value = faktura.datumNaIzdavanje
   
    cell = worksheet.getCell("E16");
    cell.value = faktura.arhivskiBroj

    cell = worksheet.getCell("H17");
    cell.value = "Рок за плаќање"
   
    cell = worksheet.getCell("K17");
    cell.value = faktura.rokZaNaplata



    cell = worksheet.getCell("H20");
    cell.value = faktura.dataOd + " - " + faktura.dataDo

    

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
    cell.value = faktura.vkupenIznosNaFakturaBezDDV.toFixed(2)
    

    cell = worksheet.getCell("B32");
    cell.value = "ДДВ ("+vkupno.DDVProcent+"%):"

    cell = worksheet.getCell("J32");
    cell.value = (faktura.vkupenIznosNaFakturaBezDDV * (vkupno.DDVProcent/100.0)).toFixed(2)


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
                    generirajBroiloTabela(firma.adresaNaFirma,broilo.brojMernoMesto,broilo.datumPocetok,broilo.datumKraj,broilo.brojBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
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

            const istiStorni = await StornoDisplay.findAll({where:{fakturaId:faktura.id,brojNaBroilo:storno.brojNaBroilo}})
            if(istiStorni!==null){
               
               for(istoStorno of istiStorni){
                    if(istoStorno.tarifa==="1.1.1.8.1.255"){
                        vtpocetna=istoStorno.pocetnaSostojba
                        vtkrajna=istoStorno.krajnaSostojba
                        vtrazlika=(parseFloat(vtkrajna)-parseFloat(vtpocetna)).toFixed(1)
                        vtmulti=istoStorno.multiplikator
                        vtkolicina=istoStorno.vkupnoKolicina
                    }else if(istoStorno.tarifa==="1.1.1.8.2.255"){
                        ntpocetna=istoStorno.pocetnaSostojba
                        ntkrajna=istoStorno.krajnaSostojba
                        ntrazlika=(parseFloat(ntkrajna)-parseFloat(ntpocetna)).toFixed(1)
                        ntmulti=istoStorno.multiplikator
                        ntkolicina=istoStorno.vkupnoKolicina
                    }
                    generirajBroiloTabela(firma.adresaNaFirma,istoStorno.brojNaMernoMesto,istoStorno.datumNaPocetokNaMerenje,istoStorno.datumNaZavrshuvanjeNaMerenje,istoStorno.brojNaBroilo,vtpocetna,vtkrajna,vtrazlika,vtmulti,vtkolicina,ntpocetna,ntkrajna,ntrazlika,ntmulti,ntkolicina,worksheet,red)
                    
                }
            }
            red = red + 9
        }

    }
    const kamati =await  Kamata.findAll({where:{fakturaDisplayId:faktura.id}})
    let kamatarow=30
    for(kamata of kamati){
        worksheet.insertRow(kamatarow);
        
        let fakturastokasni = await Faktura.findOne({where:{id:kamata.fakturaStoKasniId}})
        try{worksheet.mergeCells('B'+(kamatarow)+':I'+(kamatarow));} catch(e){}
        cell = worksheet.getCell("B"+kamatarow);
        cell.value = "Казнена камата за фактура " + fakturastokasni.arhivskiBroj
        cell = worksheet.getCell("J"+kamatarow);
        cell.value = kamata.suma
        cell = worksheet.getCell("K"+kamatarow)
        cell.value = "ден."
        
        kamatarow=kamatarow+1

    }


    worksheet.getCell("B23").value = "Електрична енергија (НТ):"
    worksheet.getCell("J23").value = faktura.elektricnaEnergijaNT

    worksheet.insertRow(24)

    worksheet.getCell("B24").value = "Цена по kWh без ДДВ (НТ):"
    worksheet.getCell("J24").value = faktura.cenaKwhBezDDVNT
    worksheet.getCell("K24").value = "ден."

    worksheet.insertRow(25)


    worksheet.getCell("B25").value = "Електрична енергија (ВТ):"
    worksheet.getCell("J25").value = faktura.elektricnaEnergijaVT
    worksheet.getCell("K25").value = "kWh"

    worksheet.getCell("B26").value = "Цена по kWh без ДДВ (ВТ):"
    worksheet.getCell("J26").value = faktura.cenaKwhBezDDVVT
    worksheet.getCell("K26").value = "ден."


    console.log(faktura.elektricnaEnergijaNT)
    // worksheet.insertRow(24)

    // cell = worksheet.getCell("B24");
    // cell.value = "Цена по kWh без ДДВ(НТ):"
    
    // cell = worksheet.getCell("J24");
    // cell.value = faktura.cenaKwhBezDDVNT.toFixed(4)

    // cell = worksheet.getCell("B23");
    // cell.value = "Електрична енергија (НТ):"
    

        await workbook.xlsx.writeFile("../fakturi/"+firma.name+"-"+faktura.arhivskiBroj+".xlsx");
    
        

}


module.exports = {toExcel}