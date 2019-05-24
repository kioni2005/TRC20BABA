module.exports = {
  networks: {
    development: {
      privateKey:
        "86134c8a51446c21b501f3a05844e18fdb72d3a5420867737c8640ce0ec656ca",
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
  }
};
