const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          "5B83936952A82F58010BDB32B16403B640B91E7DFB96325BA209B56D4E52FD14",
          "https://kovan.infura.io/v3/9fe5eb4f33964a93a62ac085ca877f93"
        );
      },
      network_id: 42,
    },
  },
};
