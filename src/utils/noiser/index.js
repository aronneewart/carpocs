import crypto from 'crypto'

const noiser = ([array, index]) => [
  array,
  index,
  [...Array(parseInt(array.length / 3))]
    .map(() => crypto.randomInt(0, array.length))
    .sort((a, b) => a - b)
    .map((i) => {
      array.splice(i, 0, crypto.randomInt(0, 100))
      return i
    })
    .sort(() => crypto.randomInt(0, 1000) / 1000 - 0.5),
]

export default noiser
