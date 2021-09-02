import readline from 'readline'
import { Writable } from 'stream'

const prompt = (text, options = {}) =>
  new Promise((resolve, reject) => {
    const mutableStdout = new Writable({
      write: function (chunk, encoding, callback) {
        if (!this.muted) process.stdout.write(chunk, encoding)
        callback()
      },
    })

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true,
    })

    rl.question(text, (answer) => {
      mutableStdout.muted = false
      resolve(answer)
      rl.close()
    })

    mutableStdout.muted = !!options.muted
  })

export default prompt
