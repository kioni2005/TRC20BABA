var Baba = artifacts.require("./Baba.sol");
var Market = artifacts.require("./Market.sol");
// let owner = "412ce21916f8c790a66e16111dcfa0dd92e31f0efe"; //shasta
// let owner = "416062cd0effc68730d8acade46618aabd06d8d992"; //quickstart
let owner = 'TJkrEHjJ11ydpoxXEo53u6ZnrRsfxxMHAV'

module.exports = function(deployer) {
  deployer.deploy(Baba, "Tronbaba", "BABA", 6, 27000000000, owner).then(() => {
    return deployer.deploy(Market, Baba.address);
  });
};
