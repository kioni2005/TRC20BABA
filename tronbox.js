module.exports = {
  networks: {
    development: {
      privateKey:
        "cf0396e69230fc6a44f66b08fb7510d0f3895659bc94e854da92edf30a1ef331",
      fullHost: "http://127.0.0.1:9090",
      network_id: "9"
    },
    shasta: {
      from: process.env.FROM,
      privateKey: process.env.PRIVATE_KEY,
      userFeePercentage: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*" // Match any network id
    },
    production: {
      from: process.env.FROM,
      privateKey: process.env.PRIVATE_KEY,
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      userFeePercentage: 100,
      fullHost: "https://api.trongrid.io",
      network_id: "1" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.4.25",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
