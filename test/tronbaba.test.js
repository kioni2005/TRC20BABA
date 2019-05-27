require("chai")
  .use(require("chai-shallow-deep-equal"))
  .use(require("chai-as-promised"))
  .should();

var Tronbaba = artifacts.require("./Tronbaba.sol");

//Test for deploying TronBaba TRC-20 token and checking parameters
contract("Tronbaba", ([owner, random, random2, random3]) => {
  let name = "Tronbaba";
  let symbol = "BABA";
  let decimals = 6;
  let supply = 27000000000;
  let baba;

  beforeEach(async () => {
    //Deploy a new token with each test
    baba = await Tronbaba.deployed();
  });

  describe("BABA:details", () => {
    it("should return correct token symbol", async () => {
      let _symbol = await baba.symbol();
      _symbol.should.be.equal(symbol, "incorrect symbol");
    });

    it("should return correct token decimals", async () => {
      let _decimals = await baba.decimals();

      _decimals
        .toString()
        .should.be.equal(String(decimals), "incorrect token decimals");
    });

    it("should return correct token supply", async () => {
      let _totalSupply = await baba.totalSupply();

      //Supply is the uint amount including decimals
      _totalSupply
        .toString()
        .should.be.equal(
          String(supply * 10 ** decimals),
          "incorrect token supply"
        );
    });
  });

  describe("BABA:balance", () => {
    it("should return correct balance for initial owner", async () => {
      let _balance = await baba.balanceOf(tronWeb.address.toHex(owner));

      _balance
        .toString()
        .should.be.equal(
          String(supply * 10 ** decimals),
          "incorrect balance of owner"
        );
    });

    it("should return 0 for balance of random addrress", async () => {
      let _balance = await baba.balanceOf(tronWeb.address.toHex(random));

      _balance.toString().should.be.equal("0", "incorrect balance of owner");
    });
  });

  describe("BABA:transfer", () => {
    it("should transfer correct amount from owner to random", async () => {
      await baba.transfer(random, 100000).should.be.fulfilled;

      let _balance = await baba.balanceOf(random);
      _balance
        .toString()
        .should.be.equal("100000", "incorrect balance of random");
    });

    it("should set the correct allowance", async () => {
      //Owner approves random address to spend x amount of tokens from his balance
      await baba.approve(random, 100000).should.be.fulfilled;

      let _allowance = await baba.allowance(owner, random);

      _allowance
        .toString()
        .should.be.equal("100000", "incorrect token allowance");
    });

    it("sender should be able to spend approved tokens from other account", async () => {
      //Owner approves random address to spend x amount of tokens from his balance
      await baba.approve(random, 100000).should.be.fulfilled;

      //random address transfers approve tokens from owner to random2
      await baba.transferFrom(owner, random2, 100000, { from: random }).should
        .be.fulfilled;

      let _balance = await baba.balanceOf(tronWeb.address.toHex(random2));

      _balance
        .toString()
        .should.be.equal("100000", "incorrect balance of random");
    });

    it("sender should not be able to spend more than approved tokens ", async () => {
      //Owner approves random address to spend x amount of tokens from his balance
      await baba.approve(random, 100000, { from: owner }).should.be.fulfilled;

      //random address transfers approve tokens from owner to random2
      await baba.transferFrom(owner, random3, 200000, { from: random });

      let _balance = await baba.balanceOf(tronWeb.address.toHex(random3));

      _balance.toString().should.be.equal("0", "balance changed");
    });
  });

  describe("BABA:burn", () => {
    it("should be able to burn tokens from his balance", async () => {
      //Get initial Balance of the address before burning
      let startBalance = await baba.balanceOf(owner);
      await baba.burn(100000).should.be.fulfilled;

      //Check new Balance from address after burning
      let _balance = await baba.balanceOf(owner);

      // Check if new balance is supply - burnt amount
      _balance
        .toString()
        .should.be.equal(
          String(Number(startBalance) - 100000),
          "incorrect balance after burn"
        );
    });

    it("should not be able to burn tokens without owning the amount", async () => {
      //First transfer random some tokens to check it does not change balance
      await baba.transfer(random, 100000).should.be.fulfilled;
      let startBalance = await baba.balanceOf(tronWeb.address.toHex(random));

      //Burn Request of more tokens than owned
      await baba.burn(99999999999, { from: tronWeb.address.toHex(random) });

      //Check if balance changed
      let _balance = await baba.balanceOf(tronWeb.address.toHex(random));
      _balance
        .toString()
        .should.be.equal(startBalance.toString(), "balance changed");
    });
  });
});
