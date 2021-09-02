import crypto from 'crypto'
import hash from '../hash'

const lhash = (text, steps = 1) =>
  steps--
    ? lhash(hash(text.substring(0, parseInt(text.length) / 2)), steps) +
      lhash(hash(text.substring(parseInt(text.length) / 2), text.length), steps)
    : text

export default lhash
