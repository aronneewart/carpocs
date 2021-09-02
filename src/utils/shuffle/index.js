import crypto from 'crypto'

const shuffle = (array) => {
  const index = [...Array(array.length).keys()].sort(
    () => crypto.randomInt(0, 1000) / 1000 - 0.5,
  )
  return [index.map((i) => array[i]), index]
}

export default shuffle
