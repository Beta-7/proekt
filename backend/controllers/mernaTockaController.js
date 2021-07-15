
const Firma = require("../models/firma")
const MernaTocka = require("../models/mernaTocka")

const dodadiMernaTocka = (req, res) => {
    //tockaID
    //cena
    //firma
    const tockaID=req.body.tockaID
    const cena=parseFloat(req.body.cena)
    const firmaID=req.body.firmaID

    MernaTocka.findOne({where:{tockaID: req.body.tockaID}}).then((user)=>{
        if(user!==null){
            return res.json({"message":"Error","detail":"Merna tocka already exists"})
        }
        Firma.findOne({where:{id:firmaID}}).then((firma)=>{

            MernaTocka.create({
                tockaID,
                cena,
                "firmaId":firma.id
            }).then(()=>{
                return res.send({"message":"success","detail":"Successfully added company"})})    
        })


       
    })
    
}

async function asocirajMernaTocka(req,res){
        //tockaID
        //firmaID
    const MT = await MernaTocka.findOne({where:{
        tockaID:req.body.tockaID
    }})
    const firma = await Firma.findOne({where:{
        id:req.body.firmaId
    }})
    if(MT === null || firma === null){
        return res.json({"message":"error","detail":"MernaTocka or Firma doesn't exist"})
    }

    MernaTocka.update({firmaId:req.body.firmaId}, {
        where:{tockaID:req.body.tockaID}
    }).then(()=>{
        return res.json({message:"Success",detail:"Updated Merna Tocka"})
    })

}

const smeniCenaNaMernaTocka=(req,res)=>{

}

module.exports={dodadiMernaTocka,asocirajMernaTocka,smeniCenaNaMernaTocka}