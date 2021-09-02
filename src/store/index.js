import debug from 'debug'
import * as bip39 from 'bip39'

import message from '../utils/message'
import prompt from '../utils/prompt'
import encrypt from '../utils/encrypt'
import encryptFile from '../utils/encrypt/file'
import shuffle from '../utils/shuffle'
import noiser from '../utils/noiser'
import sleep from '../utils/sleep'
import * as cardano from '../utils/cardano'

import {
  askForWallet,
  askForOrigin,
  askForNewWallet,
  askForAddress,
  askForBalance,
  askIfDeleteWallet,
  finalMessage,
} from './helpers'

import config from '../config'

const { WALLET } = config

const log = debug('store')

;(async () => {
  try {
    //
    // Load an existing wallet living in the node or create/restore a new one
    // from a mnemonic sentence
    //
    const [wallet, passphrase] = await (async (wallet_option) => {
      switch (wallet_option) {
        case 0:
          return await (async (w, p) => {
            do {
              w = await cardano.RestoreWallet(
                ...(await (async (option) => {
                  while (true) {
                    const [name, mnemonic_sentence, passphrase] =
                      await (async () => {
                        switch (option) {
                          case 0: {
                            return [
                              await prompt('Wallet name: '),
                              await prompt(
                                'Recovery phrase (space separated): ',
                              ),
                              await prompt('Passphrase (at least 10 charts): '),
                            ]
                          }
                          case 1: {
                            return [
                              `Wallet - ${new Date().toLocaleString()}`,
                              bip39.generateMnemonic(256),
                              (Math.random() + 1).toString(36).substring(2) +
                                (Math.random() + 1).toString(36).substring(2),
                            ]
                          }
                          case 2: {
                            return [
                              WALLET.NAME,
                              WALLET.MNEMONIC_SENTENCE,
                              WALLET.PASSPHRASE,
                            ]
                          }
                        }
                      })()

                    if (option === 2) {
                      message(
                        'Please copy the following information before continuing:\n\n',
                      )
                      message(`name: ${name}\n`)
                      message(`mnemonic_sentence: ${mnemonic_sentence}\n`)
                      message(`passphrase: ${passphrase}\n\n`)

                      while (
                        !['y', 'Y'].includes(await prompt(`Ready? [y|n]: `))
                      );
                    }

                    // Checking values
                    switch (true) {
                      case [null, undefined, ''].includes(name):
                        message(`\n\nError: The wallet name can't be empty\n\n`)
                        break
                      case !bip39.validateMnemonic(mnemonic_sentence):
                        message(`\n\nError: Invalid mnemonic sentence\n\n`)
                        break
                      case passphrase.length < 10:
                        message(
                          `\n\nError: The passphrase must be at least 10 chars long\n\n`,
                        )
                        break
                      default:
                        p = passphrase

                        return [name, mnemonic_sentence.split(' '), passphrase]
                    }
                  }
                })(await askForOrigin())),
              )

              message(`\n\nPlease wait until the wallet is ready ...\n\n`)
              while (true) {
                const { state } = await cardano.GetWallet(w.id)
                message(
                  `Wallet ${state.status} - ${
                    state.progress
                      ? state.progress.quantity
                      : state.status === 'syncing'
                      ? '0'
                      : '100'
                  }%\n`,
                )
                if (state.status === 'ready') break
                await sleep(10000)
              }
            } while (w.code)
            return [w, p]
          })({}, '')
        default:
          return [
            (await cardano.ListWallets())[wallet_option - 1],
            await prompt('Passphrase: '),
          ]
      }
    })(await askForWallet(await cardano.ListWallets()))

    //
    // Specify the address used to send back the dummy ADA sent in the
    // transaction
    //
    const address = await (async () => {
      switch (await askForAddress()) {
        case 0:
          return (await cardano.ListAddresses(wallet.id))[0]
        case 1:
          return await (async (a) => {
            do {
              a = await prompt(
                a
                  ? 'Please enter a valid address: '
                  : 'Pleace enter an addresss: ',
              )
            } while ((await cardano.InspectAddress(a)).code)
            return a
          })()
      }
    })()

    //
    // Encrypt and obfuscate the recovery phrase
    //
    let [data, index, noise] = noiser(
      shuffle(
        encrypt(
          await prompt('Enter the recovery phrase: '),
          await prompt('Enter the story: '),
        ),
      ),
    )
    data = data.join(' ')

    const metadata = {
      0: {
        list: [...Array(Math.ceil(data.length / 64)).keys()]
          .reduce((a, i) => [...a, data.substring(64 * i, 64 * (i + 1))], [])
          .map((s) => ({ string: s })),
      },
    }

    //
    // Checking wallet balance. If insufficient ask for funds
    //

    for (
      let w = await cardano.GetWallet(wallet.id);
      w.balance.available.quantity < 2000000;
      w = await cardano.GetWallet(wallet.id)
    )
      await askForBalance(
        `Not enough balance, please deposit ${
          2000000 - w.balance.available.quantity
        } lovelace into one of the following addresses:\n\n${(
          await cardano.ListAddresses(wallet.id)
        )
          .map(({ id }) => id)
          .join(`\n`)}\n`,
      )

    //
    // Generate the transaction with the encrypted recovery phrase as metadata
    //
    const transaction = await cardano.CreateTransaction(
      wallet.id,
      address.id,
      metadata,
      passphrase,
    )

    for (
      let s = 'starting';
      s !== 'in_ledger';
      s = (await cardano.GetTransaction(wallet.id, transaction.id)).status
    ) {
      message(`Transaction ${s} ...\n`)
      if (['expired'].includes(s)) throw new Error('Transaction failed!')
      await sleep(5000)
    }

    if (await askIfDeleteWallet()) await cardano.DeleteWallet(wallet.id)

    const fileName = await encryptFile(
      [index, noise, transaction.id],
      await prompt('Please enter file encryption password: '),
    )

    finalMessage(fileName, transaction.id)
  } catch (err) {
    log(err)
  }
})()
