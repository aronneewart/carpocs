export const cla = ((args) =>
  ['--file'].reduce((object, arg) => {
    const index = args.indexOf(arg)

    if (index < 0) return object

    switch (arg) {
      case '--file':
        return { ...object, [arg]: args[index + 1] }
      default:
        throw new Error(`Argument '${arg}' unhandled in readArguments!`)
    }
  }, {}))(process.argv.slice(2))

import promptMenu from '../utils/prompt/menu'

export const askForWallet = (wallets) =>
  promptMenu({
    title: 'Select a wallet',
    options: [
      'Create temporarily wallet',
      ...wallets.map(({ id, name }) => `${name} (${id})`),
    ],
  })

export const askForOrigin = () =>
  promptMenu({
    title: 'Get recovery phrase and passphrase from',
    options: ['.env file', 'stdin'],
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
    options: ['yes', 'no'],
  })

export const askForBalance = (title) =>
  promptMenu({
    title,
    options: ['done'],
  })

export const message = (text) => process.stdout.write(text)

export const finalMessage = (text) =>
  ((base, offset) =>
    process.stdout.write(`
${Array(base + offset * 2).join('-')}
${Array(offset).join(
  ' ',
)}Save this file into several devices and email it to yourself\n
${Array(offset).join(' ')}${text}${Array(offset).join(' ')}\n
${Array(base + offset * 2).join('-')}
`))(Math.max(80, text.length), 7)
