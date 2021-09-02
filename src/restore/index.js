import debug from 'debug'

import prompt from '../utils/prompt'
import promptMenu from '../utils/prompt/menu'
import encrypt from '../utils/encrypt'
import encryptFile from '../utils/encrypt/file'
import decrypt from '../utils/decrypt'
import decryptFile from '../utils/decrypt/file'
import shuffle from '../utils/shuffle'
import unshuffle from '../utils/unshuffle'
import noiser from '../utils/noiser'
import denoiser from '../utils/denoiser'
import * as cardano from '../utils/cardano'

import {
  cla,
  askForWallet,
  askForOrigin,
  askForNewWallet,
  askForAddress,
  askForBalance,
  askIfDeleteWallet,
  message,
  finalMessage,
} from './helpers'

const log = debug('restore')

;(async () => {
  try {
    const args = cla

    //
    // Load an existing wallet living in the node or create/restore a new one
    // from a mnemonic sentence
    //
    const wallet = await (async (wallet_option) => {
      switch (wallet_option) {
        case 0:
          return await (async (w) => {
            do {
              w = await cardano.RestoreWallet(
                ...((await askForOrigin())
                  ? [
                      await prompt('Wallet name: '),
                      await prompt('Wallet recovery phrase: '),
                      await prompt('Wallet passphrase: '),
                    ]
                  : []),
              )
            } while (w.code)
            return w
          })({})
        default:
          return (await cardano.ListWallets())[wallet_option - 1]
      }
    })(await askForWallet(await cardano.ListWallets()))

    //
    // Decrypt file
    //
    const [index, noise, transaction_id] = await decryptFile(
      args['--file'],
      await prompt('Enter decryption password: ', { muted: true }),
    )

    //
    // Get metadata from the blockchain
    //
    log(
      decrypt(
        unshuffle(
          denoiser([
            (await cardano.GetTransaction(wallet.id, transaction_id)).metadata[
              '0'
            ].list
              .reduce((s, { string }) => s + string, '')
              .split(' ')
              .map((n) => parseInt(n)),
            index,
            noise,
          ]),
        ),
        await prompt('Enter story: '),
      ),
    )
  } catch (err) {
    log(err.message)
  }
})()
