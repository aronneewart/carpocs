const denoiser = ([array, index, noise]) => {
  noise.sort((a, b) => b - a).forEach((i) => array.splice(i, 1))
  return [array, index]
}

export default denoiser
