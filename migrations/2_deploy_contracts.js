let Baba = artifacts.require("./Baba.sol");
let Market = artifacts.require("./Market.sol");
let Exchanger = artifacts.require("./Exchanger.sol");

// let owner = "TDuFZiDThj87YJtbUjrp4y6W5KvcstBP3M";
let owner = "TJkrEHjJ11ydpoxXEo53u6ZnrRsfxxMHAV"; //Quickstart

module.exports = function(deployer, network, accounts) {
  if (network === "shasta")
    deployer
      .deploy(Market, "TLD1ckq9cDDqgTNGFcWCDDbTA9i3C5C9qT", 1000030 /* trc10 */)
      .then(() => {
        deployer.deploy(
          Exchanger,
          Baba.address,
          1000001 /* trc10 */,
          Market.address
        );
      });
  if (network === "production")
    deployer
      .deploy(Market, "TSRp9Y5H7ozyWQ4XUdVtRVfwXzegr9cF3x", 1001801 /* trc10 */)
      .then(() => {
        deployer.deploy(
          Exchanger,
          Baba.address,
          1000001 /* trc10 */,
          Market.address
        );
      });
  else {
    deployer
      .deploy(Baba, "Tronbaba", "BABA", 6, 27000000000, owner)
      .then(() => {
        deployer.deploy(Market, Baba.address, 1000001 /* trc10 */);
      })
      .then(() => {
        deployer.deploy(
          Exchanger,
          Baba.address,
          1000001 /* trc10 */,
          Market.address
        );
      });
  }
};
