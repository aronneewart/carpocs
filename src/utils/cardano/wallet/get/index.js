import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:wallet:get')

const cardanoWalletGet = async (walletId) =>
  await fetchCardano(`/wallets/${walletId}`)

export default cardanoWalletGet
