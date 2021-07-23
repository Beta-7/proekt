const Firma = require("../models/firma.js")
const Faktura = require("../models/faktura")
const BroiloStatus = require("../models/broiloStatus")


const generirajFakturi = async function(req, res){
    // 1. Pomini gi site firmi
    // 2. Proveri dali firmata ima broiloStatus za ovoj mesec
    // 3. Ako ima spoj gi i kreiraj red vo tabelata
    var godina = req.body.godina
    var mesec = req.body.mesec

    godina="2021"
    mesec="03"
    // console.log("asd "+Faktura.Instance.Prototype)
    // return
    Firma.findAll({
        //TODO: da raboti
    }).then((result)=>{
        result.map((firma)=>{
            Faktura.create({
                brojNaFaktura:"05-2021",
                mesec:03,
                godina:2021,
                firmaId:firma.id
            }).then((faktura)=>{
                console.log(godina+"."+mesec+"-"+mesec)
                firma.getBroilo({
                    where:{
                        mesec:godina+"."+mesec+"-"+mesec
                    }
                }).then((result)=>{
                    result.map((broilo)=>{
                        //TODO: Da se presmetaat vrednostite vo Faktura polinjata i da se popolnat tuka
                        console.log("Dodadi "+broilo.id+" na faktura "+faktura.id)
                        faktura.addBroilo(broilo)
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