import debug from 'debug'
import * as bip39 from 'bip39'

import * as cardano from '../../utils/cardano'

const log = debug('utils:cardano:wallet:list')

;(async () => {
  try {
    const name = `Test wallet - ${new Date().toLocaleString()}`
    const mnemonic_sentence = bip39.generateMnemonic(256)
    const passphrase =
      (Math.random() + 1).toString(36).substring(2) +
      (Math.random() + 1).toString(36).substring(2)

    log('Restoring wallet')
    const wallet = await cardano.RestoreWallet(
      name,
      mnemonic_sentence.split(' '),
      passphrase,
    )
    log(wallet)

    log('Listing wallets')
    log(await cardano.ListWallets())

    log('Listing addresses')
    log(await cardano.ListAddresses(wallet.id))

    log('Delete wallet')
    await cardano.DeleteWallet(wallet.id)
  } catch (e) {
    log(e)
  }
})()
