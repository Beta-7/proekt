const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const BroiloController=require("../controllers/broiloController")
//TODO: kamatna stapka
const updateZelenaEnergija = (req, res) => {
    req.body.mesec=parseInt(req.body.mesec)
    
    if(req.body.mesec < 1 && req.body.mesec > 12 || isNaN(req.body.mesec)){
        return res.json({"message":"error","detail":"bad format"})        
    }
    if(req.body.godina < 2020 && req.body.godina > 2100 || isNaN(req.body.mesec)){
        return res.json({"message":"error","detail":"bad format"})        
    }
    

    try{
    var vkupnoPotrosena=0

    if(req.body.mesec<10){
        req.body.mesec="0"+req.body.mesec
    }
    
    console.log(req.body.mesec)
    VkupnoPotrosena.findOne({
        where:
        {
            mesec:req.body.mesec,
            godina:req.body.godina
        }
    }).then((row)=>{
        row.zelenaKolicina=req.body.vkupno
        row.zelenaCena=req.body.cena
        vkupnoPotrosena = row.vkupnoPotrosena
        console.log(req.body)
        // console.log(vkupnoPotrosena)
        row.update({
            zelenaKolicina:req.body.vkupno,
            zelenaCena:req.body.cena,
            nadomestZaOrganizacija:req.body.organizacija,
            kamatnaStapka:req.body.kamata,
            DDVProcent:req.body.DDVProcent
        })
    }).then(()=>{
        BroiloController.presmetajProcent(req.body.mesec,req.body.godina, vkupnoPotrosena, req.body.vkupno)

    })
    return res.json({"message":"success","detail":"updated"})
    }
    catch{

        return res.json({"message":"error","detail":"error"})
    }

}

module.exports={updateZelenaEnergija}