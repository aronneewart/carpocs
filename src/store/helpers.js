import promptMenu from '../utils/prompt/menu'
import config from '../config'

const { ENV } = config

export const askForWallet = (wallets) =>
  promptMenu({
    title: 'Select a wallet',
    options: [
      'Create new wallet',
      ...wallets.map(({ id, name }) => `${name} (${id})`),
    ],
  })

export const askForOrigin = () =>
  promptMenu({
    title: 'Get recovery phrase and passphrase from',
    options: ['stdin', 'random', '.env file'],
  })

export const askForNewWallet = ({ code }) =>
  promptMenu({
    title: code
      ? 'Something went wrong'
      : 'Down below a series of parameters will be asked to create/restore the wallet',
    options: [code ? 'try again' : 'ok'],
  })

export const askForAddress = () =>
  promptMenu({
    title: 'Send transaction to the selected wallet in the previous step?',
    options: ['yes', 'no'],
  })

export const askIfDeleteWallet = () =>
  promptMenu({
    title: 'Delete wallet after use?',
    options: ['no', 'yes'],
  })

export const askForBalance = (title) =>
  promptMenu({
    title,
    options: ['done'],
  })

export const finalMessage = (text, id) =>
  ((base, offset) =>
    process.stdout.write(`
${Array(base + offset * 2).join('-')}
${Array(offset).join(
  ' ',
)}Save this file into several devices and email it to yourself\n
${Array(offset).join(' ')}${text}${Array(offset).join(' ')}\n\n
${Array(offset).join(' ')}You can check the transaction at
${Array(offset).join(' ')}${
      ENV === 'testnet'
        ? `https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${id}`
        : `https://explorer.cardano.org/en/transaction?id=${id}`
    }
${Array(base + offset * 2).join('-')}
`))(Math.max(120, text.length), 7)
