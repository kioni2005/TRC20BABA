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
async function createToken(to, pvky) {
  let tx = await tronWeb.transactionBuilder.createToken(
    options,
    tronWeb.address.toHex(to)
  );

  let res = await tronWeb.trx.sign(tx, pvky);

  tronWeb.trx.sendRawTransaction(res).then(tx => {
    if (tx.result) {
      console.log("Token created successfully");
    }
  });
}

process.env.NETWORK == 0
  ? createToken(
      "TJkrEHjJ11ydpoxXEo53u6ZnrRsfxxMHAV",
      "cf0396e69230fc6a44f66b08fb7510d0f3895659bc94e854da92edf30a1ef331"
    )
  : createToken(process.env.FROM, process.env.PRIVATE_KEY);
