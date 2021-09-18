const MernaTocka = require("../../models/mernaTocka")

async function migrate(){
    const tocki = await MernaTocka.findAll({raw: true}, {where:{cenaNT:null}})
    console.log("starting migration")
    let a = 1
    for (tocka of tocki){
        console.log("Tocka "+a+" od "+tocki.length)
        // console.log(tocka)
        if(tocka.tarifa=="1.1.1.8.1.255"){//visoka
            let cenaVT = tocka.cena
            let tockaNT = await MernaTocka.findOne({where:{
                tockaID:tocka.tockaID,
                tarifa:"1.1.1.8.2.255"
            }})
            let cenaNT
            if(tockaNT!==null){
            cenaNT = tockaNT.cena
            await MernaTocka.destroy({where:{id:tockaNT.id}})
            }else{
            cenaNT = 0
            }

        console.log(cenaVT, cenaNT)
        await MernaTocka.update({cenaNT, cenaVT}, {where:{id:tocka.id}})
    }
    


    a=a+1
}
const tockiNT = await MernaTocka.findAll({where:{tarifa:"1.1.1.8.2.255"}, cenaVT:null})
for(tocka of tockiNT){
    console.log(tocka.dataValues.id)
    await MernaTocka.update({cenaNT:tocka.dataValues.cena, cenaVT:0}, {where:{id:tocka.dataValues.id}})
}


return
}

migrate()