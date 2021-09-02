const { env } = process

// Testnet enviroment
const testnet = {
  ENV: 'testnet',
  HOST: `${env.TESTNET_PROT}://${env.TESTNET_HOST}:${env.TESTNET_PORT}/v2`,
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
  HOST: `${env.MAINNET_PROT}://${env.MAINNET_HOST}:${env.MAINNET_PORT}/v2`,
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
