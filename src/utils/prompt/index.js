import readline from 'readline'

const prompt = (text) =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(text, (answer) => {
      resolve(answer)
      rl.close()
    })
  })

export default prompt
