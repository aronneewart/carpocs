import debug from 'debug'
import crypto from 'crypto'
import fs from 'fs'

import prompt from '../../prompt'

import config from '../../../config'

const { SALT } = config

const log = debug('decryptFile')

const decryptFile = (fileName, password) =>
  new Promise(async (resolve, reject) => {
    let [cipher, iv] = fs.readFileSync(fileName).toString('utf8').split('\n')

    if (!cipher) reject(`No cipher text was found in ${fileName}`)

    if (!iv) reject(`No initial vector was found in ${fileName}`)

    iv = JSON.parse(iv)

    crypto.scrypt(
      password,
      SALT ||
        'e5d6b0480bbd656bead94092c8b41551df4a49ba23e484d1bbefa3a9a5e8da81',
      32,
      (err, key) => {
        if (err) reject(err)

        const decipher = crypto.createDecipheriv(
          'aes-256-cbc',
          key,
          new Uint8Array(Object.keys(iv).map((i) => iv[i])),
        )

        resolve(
          JSON.parse(
            decipher.update(cipher, 'hex', 'utf8') + decipher.final('utf8'),
          ),
        )
      },
    )
  })

export default decryptFile
