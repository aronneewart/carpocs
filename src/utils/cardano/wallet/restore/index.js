import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:wallet:restore)')

const cardanoWalletRestore = async (name, mnemonic_sentence, passphrase) =>
  await fetchCardano(`/wallets`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      mnemonic_sentence,
      passphrase,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

export default cardanoWalletRestore
