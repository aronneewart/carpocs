import debug from 'debug'

import fetchCardano from '../../fetch'

const log = debug('utils:cardano:addresses:inspect')

const cardanoAddressesInspect = async (addressId) =>
  await fetchCardano(`/addresses/${addressId}`)

export default cardanoAddressesInspect
