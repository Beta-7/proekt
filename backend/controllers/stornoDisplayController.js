const generateLog = require("../logs")
const StornoDisplay = require("../models/stornoDisplay")



const test = async () =>{
    StornoDisplay.create({
        tarifa: "123",
        datumNaPocetokNaMerenje: "adsasdasd",
        datumNaZavrshuvanjeNaMerenje:"123123",
        vkupnoKolicina: 12.2,
        brojNaBroilo: "123123"
    })
}


module.exports={test}