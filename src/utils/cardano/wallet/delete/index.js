import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:wallet:delete')

const cardanoWalletDelete = async (walletId) =>
  await fetchCardano(`/wallets/${walletId}`, {
    method: 'DELETE',
  })

export default cardanoWalletDelete
