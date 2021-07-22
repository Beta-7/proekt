const VkupnoPotrosena = require("../models/vkupnoPotrosena")
const BroiloController=require("../controllers/broiloController")
//TODO: kamatna stapka
const updateZelenaEnergija = (req, res) => {
    var vkupnoPotrosena=0
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
        // console.log(vkupnoPotrosena)
        row.update({
            zelenaKolicina:req.body.vkupno,
            zelenaCena:req.body.cena
        })
    }).then(()=>{
        BroiloController.presmetajProcent(req.body.mesec,req.body.godina, vkupnoPotrosena, req.body.vkupno)

    })


}

module.exports={updateZelenaEnergija}