const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")


const generirajFakturi = async function(req, res){
    // 1. Pomini gi site firmi
    // 2. Proveri dali firmata ima broiloStatus za ovoj mesec
    // 3. Ako ima spoj gi i kreiraj red vo tabelata
    const mesec = new Date().getFullYear();
    const godina = new Date().getMonth()+1;
    Firma.findAll({
        //TODO: da raboti
    }).then((result)=>{
        result.map((firma)=>{
            Faktura.create({
                brojNaFaktura:"05-2021",
                mesec:03,
                godina:2021
            })

        })
    })


    return 
}


const zemiFaktura = async function(req, res){
    // Zemi red od tabelata i generiraj pdf/excel fajl
    const izbor = req.body.izbor;
    if(izbor !== "pdf" && izbor !== "excel"){
        return res.json({"message":"Invalid input","detail":"izbor must be pdf or excel"})
    }


}



module.exports={generirajFakturi, zemiFaktura}