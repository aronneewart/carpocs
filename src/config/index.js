const { env } = process

// Testnet enviroment
const testnet = {
  ENV: 'testnet',
  PROT: env.TESTNET_PROT,
  HOST: env.TESTNET_HOST,
  PORT: env.TESTNET_PORT,
  WALLET: {
    NAME: env.TESTNET_WALLET_NAME,
    MNEMONIC_SENTENCE: env.TESTNET_WALLET_MNEMONIC_SENTENCE,
    PASSPHRASE: env.TESTNET_WALLET_PASSPHRASE,
  },
  SALT: env.TESTNET_SALT,
}

// Mainnet enviroment
const mainnet = {
  ENV: 'mainnet',
  PROT: env.MAINNET_PROT,
  HOST: env.MAINNET_HOST,
  PORT: env.MAINNET_PORT,
  WALLET: {
    NAME: env.MAINNET_WALLET_NAME,
    MNEMONIC_SENTENCE: env.MAINNET_WALLET_MNEMONIC_SENTENCE,
    PASSPHRASE: env.MAINNET_WALLET_PASSPHRASE,
  },
  SALT: env.MAINNET_SALT,
  CLIENT: { CRT: env.MAINNET_CLIENT_CRT, KEY: env.MAINNET_CLIENT_KEY },
  CA: { CRT: env.MAINNET_CA_CRT },
}

const config = {
  testnet,
  mainnet,
}

export default config[env.NODE_ENV]
