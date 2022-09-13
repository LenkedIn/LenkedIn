import "@nomicfoundation/hardhat-toolbox"
//import "hardhat-dependency-compiler";
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import { config } from "./package.json"

dotenvConfig({ path: resolve(__dirname, "../../.env") })

function getNetworks(): NetworksUserConfig {
  if (!process.env.INFURA_API_KEY)
    throw new Error(
      `INFURA_API_KEY env var not set. Copy .env.template to .env and set the env var`
    )
  if (!process.env.MNEMONIC)
    throw new Error(`MNEMONIC env var not set. Copy .env.template to .env and set the env var`)

  const infuraApiKey = process.env.INFURA_API_KEY
  const accounts = { mnemonic: process.env.MNEMONIC }

  return {
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraApiKey}`,
      chainId: 5,
      accounts,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infuraApiKey}`,
      chainId: 42,
      accounts,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts,
    },
  }
}

const hardhatConfig: HardhatUserConfig = {
  solidity: config.solidity,
  paths: {
    sources: config.paths.contracts,
    tests: config.paths.tests,
    cache: config.paths.cache,
    artifacts: config.paths.build.contracts,
  },
  /*dependencyCompiler: {
      paths: ["@semaphore-protocol/contracts/verifiers/Verifier20.sol"]
  },*/
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ...getNetworks(),
  },
  typechain: {
    outDir: config.paths.build.typechain,
    target: "ethers-v5",
  },
}

export default hardhatConfig
