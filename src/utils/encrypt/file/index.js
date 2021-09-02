import debug from 'debug'
import crypto from 'crypto'
import fs from 'fs'

import prompt from '../../prompt'

import config from '../../../config'

const { SALT } = config

const log = debug('encryptFile')

const encryptFile = (data, password) =>
  new Promise(async (resolve, reject) =>
    crypto.scrypt(
      password,
      SALT ||
        'e5d6b0480bbd656bead94092c8b41551df4a49ba23e484d1bbefa3a9a5e8da81',
      32,
      (err, key) => {
        if (err) reject(err)

        crypto.randomFill(new Uint8Array(16), (err, iv) => {
          if (err) reject(err)

          const fileName = `encrypt_and_mail_me_${new Date().toISOString()}.json`

          const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

          fs.writeFileSync(
            fileName,
            cipher.update(JSON.stringify(data), 'utf8', 'hex') +
              cipher.final('hex') +
              '\n',
          )

          fs.appendFileSync(fileName, JSON.stringify(iv))

          resolve(fileName)
        })
      },
    ),
  )

export default encryptFile
