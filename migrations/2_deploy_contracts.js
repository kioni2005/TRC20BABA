var Tronbaba = artifacts.require("./Tronbaba.sol");
var Market = artifacts.require("./Market.sol");
let owner = "412ce21916f8c790a66e16111dcfa0dd92e31f0efe";

module.exports = function(deployer) {
  deployer
    .deploy(Tronbaba, "Tronbaba", "BABA", 6, 27000000000, owner)
    .then(() => {
      return deployer.deploy(Market, Tronbaba.address);
    });
};
