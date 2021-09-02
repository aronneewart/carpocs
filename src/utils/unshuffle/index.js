const unshuffle = ([array, index]) =>
  index.reduce((a, i) => {
    a[i] = array[index.indexOf(i)]
    return a
  }, [])

export default unshuffle
