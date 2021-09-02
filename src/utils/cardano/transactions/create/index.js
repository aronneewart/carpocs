import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:transactions:create')

const cardanoTransactionsCreate = async (
  walletId,
  address,
  metadata,
  passphrase,
) => {
  const body = {
    passphrase,
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
      quantity: 30,
      unit: 'second',
    },
  }

  return await fetchCardano(`/wallets/${walletId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export default cardanoTransactionsCreate
