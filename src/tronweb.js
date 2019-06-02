const TronWeb = require("tronweb");

let tronWeb;

if (process.env.NETWORK == 1) {
  console.log("Running in Tron's Mainnet");
  tronWeb = new TronWeb(
    { fullHost: "https://api.trongrid.io" },
    process.env.PRIVATE_KEY
  );
} else if (process.env.NETWORK == 2) {
  console.log("Running in Shasta Network");
  tronWeb = new TronWeb(
    { fullHost: "https://api.shasta.trongrid.io" },
    process.env.PRIVATE_KEY
  );
} else {
  console.log("Running with Tron Quickstart");
  tronWeb = new TronWeb(
    { fullHost: "http://127.0.0.1:9090" },
    "cf0396e69230fc6a44f66b08fb7510d0f3895659bc94e854da92edf30a1ef331"
  );
}

module.exports = tronWeb;
