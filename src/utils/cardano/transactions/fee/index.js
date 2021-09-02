import debug from 'debug'

import fetchCardano from '../../fetch'

import sleep from '../../../../utils/sleep'

const log = debug('utils:cardano:transactions:fee')

const cardanoTransactionsFee = async (walletId, address, metadata) => {
  const body = {
    passphrase: WALLET.PASSPHRASE,
    payments: [
      {
        address,
        amount: {
          quantity: 1000000,
          unit: 'lovelace',
        },
      },
    ],
    metadata,
    time_to_live: {
      quantity: 20,
      unit: 'second',
    },
  }

  while (true) {
    await sleep(2000)
    try {
      return await fetchCardano(`/wallets/${walletId}/payment-fees`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (e) {
      if (e.code !== 'not_enough_money') break
      else throw new Error(`${res.code} | ${res.message}`)
    }
  }
}

export default cardanoTransactionsFee
