require("chai")
  .use(require("chai-shallow-deep-equal"))
  .use(require("chai-as-promised"))
  .should();

let Market = artifacts.require("./Market.sol");
let Baba = artifacts.require("./Baba.sol");
let Exchanger = artifacts.require("./Exchanger.sol");

//Test for Tronbaba market escrow contract
contract("Market", ([owner, user1, user2, random, admin]) => {
  let baba, market, exchanger;

  beforeEach(async () => {
    baba = await Baba.deployed();
    exchanger = await Exchanger.deployed();
    market = await Market.deployed();
  });

  describe("Token Migration", () => {
    it("deposit BABA TRC20 to contract", async () => {
      await baba.approve(exchanger.address, tronWeb.toSun(1000));
      //Deposit TRC20 BABA tokens to contract
      await exchanger.depositBaba(tronWeb.toSun(1000), {
        from: owner,
        shouldPollResponse: true
      }).should.be.fulfilled;

      let balance = await exchanger.getContractBalances();
      console.log("Contract Balances:\n");
      console.log("TRC10 BABA:", balance.trc10Balance.toString());
      console.log("TRC20 BABA:", balance.trc20Balance.toString());
    });

    it.skip("user must be registered before migrating", async () => {
      await exchanger.migrateTokens({
        from: owner,
        tokenValue: 10,
        tokenId: 1000001,
        shouldPollResponse: true
      }).should.be.rejected;
    });

    it("user can migrate tokens", async () => {
      let balance = await baba.balanceOf(owner);
      console.log("\nCurrent user Balance:", balance.toString());

      await market.registerUser(owner, {
        from: owner,
        shouldPollResponse: false
      }).should.be.fulfilled;

      let balance1 = await exchanger.getContractBalances();
      console.log("\nContract Balances:");
      console.log("TRC10 BABA:", balance1.trc10Balance.toString());
      console.log("TRC20 BABA:", balance1.trc20Balance.toString());

      // let allowance = await baba.allowance(owner, exchanger.address);
      // console.log(allowance.toString());

      await exchanger.migrateTokens({
        from: owner,
        tokenValue: 1000,
        tokenId: 1000001,
        shouldPollResponse: true
      });

      let newBalance = await baba.balanceOf(owner);
      console.log("\nNew user Balance:", newBalance.toString());

      let balance2 = await exchanger.getContractBalances();
      console.log("\nContract Balances:");
      console.log("TRC10 BABA:", balance2.trc10Balance.toString());
      console.log("TRC20 BABA:", balance2.trc20Balance.toString());
    });
  });
});
