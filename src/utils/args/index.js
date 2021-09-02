const flags = { '--port': { params: 1 }, '--file': { params: 1 } }

const args = (flag, options = {}) => {
  if (!Object.keys(flags).filter((name) => flag === name).length)
    throw new Error(`Unsupported flag '${flag}'`)

  const args = process.argv.slice(2)

  const index = args.indexOf(flag)

  if (index < 0) return undefined
  else if (flags[flag].params === 0) return true

  const params = (() => {
    const params = []
    for (const i = 0; i < flags[flag].params; i++) {
      params.push(args[index + 1 + i])
      return params
    }
  })()

  return params.length === 1 ? params[0] : params
}

export default args
