import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:wallet:list')

const cardanoWalletList = async () => await fetchCardano(`/wallets`)

export default cardanoWalletList
