# BABA SMART CONTRACTS

Smart Contracts for Tronbaba. Visit us at https://www.tronbaba.com/

## Tronbaba

A combined multi Tier Decentralized E-commerce platform combining all types of buying and selling, for the general public or importers & Exporters. for creating single adds, owning your own online shop, selling your services, bulk selling & buying, and benefiting from a pool buying system.

You can read our whitepaper here: [Whitepaper](https://www.tronbaba.io/TRONBABA_WHITEPAPER.pdf)

## TRC-20 Token

BABA token will be using Tron's [TRC-20 Token standard](https://github.com/tronprotocol/tron-contracts/blob/master/contracts/tokens/TRC20/TRC20.sol). The max supply of 27 Billion BABA Tokens are minted from the beginning and the burn feature will be available.

Anyone who holds [TRC-10 BABA Token](https://tronscan.org/#/token/1001801) will need to fill a KYC form to migrate to the new TRC-20 standard. Once approved, you will receive the same amount of TRC-10 tokens you have to TRX address registered in the form (i.e. if you own 1000 TRC-10 BABA tokens, you will receive 1000 TRC-20 BABA tokens to the same TRX account)

This migration will allow a better interaction with Tronbaba platorm using smart contracts.

## Testing

If you want to run tests, please clone this repository and do the following:

Install Tronbox

```
npm install -g tronbox
```

Navigate to the contract directoryt and run this command to install dependencies:

```
cd tron-contracts
npm i
```

You will need to run a testnet using tron quickstart and docker. For this, make sure you have docker installed and then run:

```
//Pull the image
docker pull trontools/quickstart

//Run the image to start local tron network and create 5 new accounts
docker run -it --rm \
  -p 9090:9090 \
  -e "mnemonic=evoke album shoulder raven oyster keep marine office sunset supreme whip forest" \
  -e "accounts=7" \
  -e "defaultBalance=100000" \
  -e "showQueryString=true" \
  -e "showBody=true" \
  -e "formatJson=true" \
  --name tron \
  trontools/quickstart
```

If you don't have docker, please install it first according to your OS: [Docker](https://docs.docker.com/install/)

Make sure the docker run command creates 7 accounts and you can see the accounts and their private keys, each one with a 10.000 TRX balance. Press Ctrl + C and run the command again if you cannot see the accounts.

You can run the following command in a new terminal to retrieve the accounts and private keys from the running tron network:

```
curl http://127.0.0.1:9090/admin/accounts
```

If you use a different mnemonic, you will need to update the private key in the tronbox.js file, under the "development" network, and the "2_deploy_contracts.js" file located in the migrations folder, replacing the private key and owner address.

Define an environmental file (.env) in the root folder, and copy:

```
NETWORK=0
```

Next, in a different terminal, you will need to run the following commands from the tron-contracts folder:

```
//create a TRC10 token in quickstart
node src/createTRC10

//Run tests
npm run test

```

## Info
