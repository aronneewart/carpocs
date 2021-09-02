import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:addresses:list')

const cardanoAddressesList = async (walletId) =>
  await fetchCardano(`/wallets/${walletId}/addresses?state=unused`)

export default cardanoAddressesList
