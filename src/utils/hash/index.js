import crypto from 'crypto'

const hash = (text, steps = 1) =>
  steps--
    ? hash(crypto.createHash('sha256').update(text).digest('hex'), steps)
    : text

export default hash
