require("chai")
  .use(require("chai-shallow-deep-equal"))
  .use(require("chai-as-promised"))
  .should();

let Market = artifacts.require("./Market.sol");
let Baba = artifacts.require("./Baba.sol");

//Test for Tronbaba market escrow contract
contract("Market", ([owner, user1, user2, random, admin, tradeAdmin]) => {
  let baba, market;

  beforeEach(async () => {
    baba = await Baba.deployed();
    market = await Market.deployed();
  });

  describe("Market:access", () => {
    it("correct owner of contract", async () => {
      let _owner = await market.owner();
      _owner.should.be.equal(tronWeb.address.toHex(owner), "incorrect owner");
    });

    it("random address cannot add admin", async () => {
      await market.addAdmin(admin, { from: random });
      let isAdmin = await market.isAdmin(admin);
      isAdmin.should.be.false;
    });

    it("only owner can add admin", async () => {
      await market.addAdmin(admin, { from: owner });
      let isAdmin = await market.isAdmin(admin);
      isAdmin.should.be.true;
    });

    it("only owner can register users", async () => {
      await market.registerUser(user1, { from: owner }).should.be.fulfilled;
      await market.registerUser(user2, { from: owner }).should.be.fulfilled;
    });
  });

  describe("Market:trades", () => {
    it("only owner can send minted baba tokens", async () => {
      await baba.transfer(user1, 10000, { from: owner });
      let balance1 = await baba.balanceOf(user1);
      balance1.toString().should.be.equal("10000");
      await baba.transfer(user2, 10000, { from: owner });
      let balance2 = await baba.balanceOf(user2);
      balance2.toString().should.be.equal("10000");
    });

    it("user cannot open trade without approving market contract first", async () => {
      await market.openTrade(123, 1000, user2, "USD", tradeAdmin, {
        from: user1
      });
      let trade = await market.trades(123);
      tronWeb.address.fromHex(trade.seller).should.not.be.equal(user2);
    });

    it("user can open trade correctly", async () => {
      await baba.approve(market.address, 1000, { from: user1 });
      await market.openTrade(123, 1000, user2, "USD", tradeAdmin, {
        from: user1
      });
      let trade = await market.trades(123);
      tronWeb.address.fromHex(trade.seller).should.be.equal(user2);
      trade.currency.should.be.equal("USD");
    });

    it("only seller can confirm one of its trades", async () => {
      await market.confirmTrade(123, { from: random });
      let trade = await market.trades(123);
      trade.confirmations.should.be.equal(0);
      await market.confirmTrade(123, { from: user2 });
      trade = await market.trades(123);
      trade.confirmations.should.be.equal(1);
    });

    it("confirmation of buyer should release funds to seller", async () => {
      //Buyer confirms trade (products arrived)
      await market.confirmTrade(123, { from: user1 });
      let trade = await market.trades(123);

      //Should show 2 confirmations (buyer + seller)
      trade.confirmations.should.be.equal(2);
      let balance = await baba.balanceOf(user1);

      // Buyers balance is decreased by trade amount
      balance.toString().should.be.equal("9000");

      //Funds are sent from escrow to seller (minus baba fee of 2%)
      balance = await baba.balanceOf(user2);
      balance.toNumber().should.be.equal(10000 + 1000 * 0.98);
    });

    it("escrow can be released by admin when there is conflict", async () => {
      await baba.approve(market.address, 2500, { from: user2 });
      await market.openTrade(124, 2500, user1, "GBP", tradeAdmin, {
        from: user2
      });
      //Seller confirms trade (send products)
      await market.confirmTrade(124, { from: user1 });
      let trade = await market.trades(124);
      trade.confirmations.should.be.equal(1);

      // Buyer says products never arrived
      // Admin steps in and find that the order did arrived
      // Admin releases funds
      await market.confirmTrade(124, { from: tradeAdmin });
      trade = await market.trades(124);
      trade.confirmations.should.be.equal(2);

      let balance = await baba.balanceOf(user2);
      // Buyers balance is decreased by trade amount
      balance.toNumber().should.be.equal(10980 - 2500);

      //Funds are sent from escrow to seller
      balance = await baba.balanceOf(user1);
      balance.toNumber().should.be.equal(9000 + 2500 * 0.98);
    });
  });
});
