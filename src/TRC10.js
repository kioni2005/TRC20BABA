const tronWeb = require("./tronweb.js");
require("./getBalances.js");
require("./readTokenByAccount.js");

let address = "TDuFZiDThj87YJtbUjrp4y6W5KvcstBP3M"; //Top Token Holder BABA
let address2 = "TPBdSZMJxyYJTZcATZqjmkYXA7DTUCnuMa"; //Top Token Holder BBT

//Token By Account
readTokenByAccount("TPBdSZMJxyYJTZcATZqjmkYXA7DTUCnuMa");

//Display BABA and BBT balances for each address
getBabaBalance(address);
getBabaBalance(address2);

//Token Info
let tokenID = 1001801; //BABA
tronWeb.trx.getTokenByID(tokenID).then(console.log);

let tokenID2 = 1000864; //BABA
tronWeb.trx.getTokenByID(tokenID2).then(console.log);
