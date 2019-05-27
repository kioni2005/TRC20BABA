TronWeb = require("tronweb");

const tronWeb = new TronWeb(
  { fullHost: "http://127.0.0.1:9090" },
  "cf0396e69230fc6a44f66b08fb7510d0f3895659bc94e854da92edf30a1ef331"
);

var Tronbaba = artifacts.require("./Tronbaba.sol");

let owner = "TJkrEHjJ11ydpoxXEo53u6ZnrRsfxxMHAV";

module.exports = function(deployer) {
  deployer.deploy(
    Tronbaba,
    "Tronbaba",
    "BABA",
    6,
    27000000000,
    tronWeb.address.toHex(owner)
  );
};
