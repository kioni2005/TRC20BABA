/*
  STEPS

  - Run Tron Quickstart
  - Migrate Smart Contract
  - Run createTRC10 script
  - wait...(??)
  - run command: source .env && node src/migrations.js

*/

//Import tronWeb module, not default package
const tronWeb = require("./tronweb.js");

//For reading Tronbaba .json file
const fs = require("fs");
const path = require("path");

//Variables
let owner = "TJkrEHjJ11ydpoxXEo53u6ZnrRsfxxMHAV";
let ownerPvky =
  "cf0396e69230fc6a44f66b08fb7510d0f3895659bc94e854da92edf30a1ef331";
let receiver = "TAJBgWgc4vNgEXqGG6WCZiYPBRvue6Thgw";
let tokenId;
let trc10Balance;

// Self Invoked Function
(async function() {
  console.log("\n");
  console.log("---TRC-10 BABA TOKENS--- \r\n");
  //Check Issued TRC-10 token info and owner
  let res = await tronWeb.trx.getAccount(owner);
  tokenId = res.asset_issued_ID;
  if (tokenId) {
    let token = await tronWeb.trx.getTokenByID(tokenId);
    console.log("TRC-10 BABA Token ID: ", tokenId);
    console.log(
      "Issuer address: ",
      tronWeb.address.fromHex(token.owner_address)
    );
    console.log("Total Supply: ", token.total_supply, "\r\n");
  } else console.log(`Account ${owner} does not have TRC10 token`);

  // Send TRC-10 token: to, amount, tokenID, privateKey
  await tronWeb.trx.sendToken(receiver, 1000, tokenId, ownerPvky);

  //Check TRC10 BABA balance of receiver
  console.log("Checking TRC10 balance of receiver account...");
  res = await tronWeb.trx.getAccount(receiver);
  if (res.assetV2) {
    console.log("Account: ", receiver);
    let obj = res.assetV2.filter(c => c.key === String(tokenId));
    if (obj.length === 1) {
      trc10Balance = obj[0].value;
      console.log(`  * ${obj[0].value} BABA(TRC-10)`);
    } else console.log(`  * 0  BABA(TRC-10)`);
  } else console.log("No Assets found");

  console.log("\r\n");

  //----BABA TRC-20 token creation-----

  console.log("---TRC-20 BABA TOKENS--- \r\n");
  //This solved the issue with contract instance "Invalid issuer address provided"
  // Tronweb configuration
  tronWeb.setAddress(tronWeb.address.toHex(owner));
  tronWeb.setPrivateKey(ownerPvky);

  let tokenAbstract = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../build/contracts/Tronbaba.json"),
      "utf8"
    )
  );

  //TRC-20 token contract ABI
  const abi = tokenAbstract.abi;

  //TRC-20 token contract address
  const tokenAddress = tokenAbstract.networks["9"].address;
  console.log(
    "TRC-20 BABA Token Address: ",
    tronWeb.address.fromHex(tokenAddress)
  );

  // Create Instance of contract
  let contract = await tronWeb.contract(abi, tokenAddress);

  // Check Balance of owner
  let balance = await contract.balanceOf(owner).call();
  console.log(`Balance of Owner: `, balance.toString(), "\r\n");

  // Send BABA token to another address
  // Amount send equal to the TRC-10 holdings
  console.log("Starting Token Swap....");
  console.log(`Transfering ${trc10Balance} to ${receiver}...`);
  await contract.transfer(tronWeb.address.toHex(receiver), trc10Balance).send();

  // Check Balance of other address
  balance = await contract.balanceOf(receiver).call();
  console.log(
    `New Balance of receiver address: `,
    balance.toString(),
    " BABA(TRC-20) \r\n"
  );
})();
