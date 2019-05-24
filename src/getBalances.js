const tronWeb = require("./tronweb.js");

// console.log(tronWeb);

let tokenID = 1001801; //BABA
let tokenID2 = 1000864; //BBT

module.exports = getBabaBalance = account => {
  tronWeb.trx.getAccount(account).then(res => {
    if (res.assetV2) {
      console.log("Account: ", account);
      let obj = res.assetV2.filter(c => c.key === String(tokenID));
      obj.length === 1
        ? console.log(`  * ${obj[0].value} BABA`)
        : console.log(`  * 0 BABA`);

      obj = res.assetV2.filter(c => c.key === String(tokenID2));
      obj.length === 1
        ? console.log(`  * ${obj[0].value} BBT`)
        : console.log(`  * 0 BBT`);
    } else console.log("No Assets found");
  });
};
