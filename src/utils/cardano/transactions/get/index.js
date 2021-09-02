import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:transactions:get')

const cardanoTransactionsGet = async (walletId, transactionId) =>
  await fetchCardano(`wallets/${walletId}/transactions/${transactionId}`)

export default cardanoTransactionsGet
