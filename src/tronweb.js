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
  console.log("Running wth Tron Quickstart");
  tronWeb = new TronWeb(
    { fullHost: "http://127.0.0.1:9090" },
    "86134c8a51446c21b501f3a05844e18fdb72d3a5420867737c8640ce0ec656ca"
  );
}

module.exports = tronWeb;
