const tronWeb = require("./tronweb.js");

options = {
  name: "Tronbaba",
  abbreviation: "BABA",
  description:
    "A vision of creating a Decentralized Multi tier platform to benefit all Sellers and buyers, whatever you wish to sell or buy",
  url: "https://www.tronbaba.io/",
  totalSupply: 27000000000,
  trxRatio: 1, // How much TRX will tokenRatio cost?
  tokenRatio: 1, // How many tokens will trxRatio afford?
  saleStart: Date.now() * 1000,
  saleEnd: Date.now() * 1000 + 999999,
  freeBandwidth: 0, // The creator's "donated" bandwidth for use by token holders
  freeBandwidthLimit: 0, // Out of totalFreeBandwidth, the amount each token holder get
  frozenAmount: 1000000000,
  frozenDuration: 1
};

//working creating asset
function createToken(to, pvky) {
  tronWeb.transactionBuilder
    .createToken(options, tronWeb.address.toHex(to))
    .then(res => {
      tronWeb.trx.sign(res, pvky).then(result => {
        tronWeb.trx.sendRawTransaction(result).then(tx => {
          if (tx.result) {
            console.log("Token created successfully");
          }
        });
      });
    });
}

//First call createToken (running both wont work)
//createToken(process.env.FROM, process.env.PRIVATE_KEY);
createToken(
  "TJdDmJVYa9TcMJvCc9WsdaEXEYgeJrGVPq",
  "86134c8a51446c21b501f3a05844e18fdb72d3a5420867737c8640ce0ec656ca"
);
