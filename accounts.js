async function newTestAccounts(amount) {
  return await tronWeb.fullNode.request(
    "/admin/temporary-accounts-generation?accounts=" + amount
  );
}

async function getTestAccounts() {
  const accounts = {
    b58: [],
    hex: [],
    pks: []
  };
  const accountsJson = await tronWeb.fullNode.request("/admin/accounts-json");
  console.log(accountsJson);
  accounts.pks = accountsJson.more[accountsJson.more.length - 1].privateKeys;
  for (let i = 0; i < accounts.pks.length; i++) {
    let addr = tronWeb.address.fromPrivateKey(accounts.pks[i]);
    accounts.b58.push(addr);
    accounts.hex.push(tronWeb.address.toHex(addr));
  }
  return accounts;
}

//newTestAccounts(5) response in docker terminal:
/*
  Sending 10000 TRX to TH8sfWpYdTwuF2bt2gi5R3MvtVFLNiuNwP
  Sending 10000 TRX to TYnfypnMVKET1UunqRRYNaMhdwv8f8gfUT
  Sending 10000 TRX to TRLTr9yn8D8vWcsqSk22F42nftiYvzS8mb
  Sending 10000 TRX to TDY7DtNc5yYKacskvgoj73fK795qTsknHf
  Sending 10000 TRX to TL7fRAj43xrxzZ5M5D7U1GG1U2UWrfFtin
*/
