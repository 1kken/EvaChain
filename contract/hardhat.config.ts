import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  typechain: {
    outDir:
      "../frontend/src/routes/(dashboard)/dashboard/(admin)/admin/block_chain/blockchain-helper/type-chain",
    target: "ethers-v6",
  },
  gasReporter: {
    currency: "PHP",
    enabled: true,
    coinmarketcap: "d424c152-850f-4322-b57c-cf459def7cf4",
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;
