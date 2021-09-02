import debug from 'debug'
import * as bip39 from 'bip39'

import encrypt from '../../utils/encrypt'
import encryptFile from '../../utils/encrypt/file'
import decrypt from '../../utils/decrypt'
import decryptFile from '../../utils/decrypt/file'
import shuffle from '../../utils/shuffle'
import unshuffle from '../../utils/unshuffle'
import noiser from '../../utils/noiser'
import denoiser from '../../utils/denoiser'

const log = debug('test:core')

;(async () => {
  const lines = Array(30).fill('-').join('')
  let step = 0

  try {
    // Sample data
    const mnemonic_sentence = bip39.generateMnemonic(256)
    const story = 'And then Charles saw the teapot in front of his very eyes'
    const password = 'secret123!'

    // Run tests!
    log(step++, 'Mnemonic sentence:', mnemonic_sentence)
    log(step++, 'Story:', story)
    log(step++, 'Password:', password)

    const c = encrypt(mnemonic_sentence, story)
    log(step++, 'Encrypting:', c.length)

    const s = shuffle(c)
    log(step++, 'Shuffling:', s[0].length, s[1].length)

    const n = noiser(s)
    log(step++, 'Nosing:', n[0].length, n[1].length, n[2].length)

    const ef = await encryptFile(n, password)
    log(step++, 'Encrypting file:', ef[0], ef[1].length)

    const df = await decryptFile(ef, password)
    log(step++, 'Decrypting file:', df[0].length, df[1].length, df[2].length)

    const d = denoiser(n)
    log(step++, 'Denoising:', d[0].length, d[1].length)

    if (s[0].map((s, i) => s !== d[0][i]).filter((s) => s).length)
      throw new Error(
        `The <data> array returned by 'denoiser' doesn't match the one returned by 'shuffle'`,
      )

    if (s[1].map((s, i) => s !== d[1][i]).filter((s) => s).length)
      throw new Error(
        `The <index> array returned by 'denoiser' doesn't match the one returned by 'shuffle'`,
      )

    const u = unshuffle(d)
    log(step++, 'Unshuffling:', u.length)

    if (u.map((u, i) => u !== c[i]).filter((u) => u).length)
      throw new Error(
        `The array returned by 'unshuffle' doesn't match the one returned by 'encrypt'`,
      )

    const p = decrypt(u, story)
    log(step++, 'Decrypting:', p)

    if (p !== mnemonic_sentence)
      throw new Error(
        `The recovery phrase returned by 'decrypt' doesn't match the original one`,
      )

    log(`${lines} Test: success ${lines}`)
  } catch (err) {
    log(`${lines} Test: fail ${lines}`)
    log(err.message)
  }
})()
