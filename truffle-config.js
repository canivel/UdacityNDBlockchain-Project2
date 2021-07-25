const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config()
console.log(process.env);


module.exports = {
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",

  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_RINKEBY),
      network_id: 4,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_ROPSTEN),
      network_id: 3,       // Ropsten's id
      gas: 5500000
    }
  },
  compilers: {
    solc: {
      version: "0.8.3",
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
};
