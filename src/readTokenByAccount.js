const tronWeb = require("./tronweb.js");

module.exports = readTokenByAccount = account => {
  tronWeb.trx.getAccount("TJdDmJVYa9TcMJvCc9WsdaEXEYgeJrGVPq").then(res => {
    if (res.asset_issued_ID)
      tronWeb.trx.getTokenByID(res.asset_issued_ID).then(console.log);
    else console.log(`Account ${account} does not have TRC10 token`);
  });
};
