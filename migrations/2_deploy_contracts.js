TronWeb = require("tronweb");

const tronWeb = new TronWeb(
  "http://127.0.0.1:9090",
  "http://127.0.0.1:9090",
  "http://127.0.0.1:9090",
  "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"
);

var Tronbaba = artifacts.require("./Tronbaba.sol");

let owner = "TH8sfWpYdTwuF2bt2gi5R3MvtVFLNiuNwP";

module.exports = function(deployer) {
  deployer.deploy(
    Tronbaba,
    "Tronbaba",
    "BABA",
    6,
    21000000000,
    tronWeb.address.toHex(owner)
  );
};
