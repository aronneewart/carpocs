import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import debug from 'debug'

import args from '../../../utils/args'
import config from '../../../config'

const { ENV, PROT, HOST, PORT, CLIENT, CA } = config

const log = debug('utils:cardano:fetch')

const cardanoFetch = async (endpoint, options = {}) => {
  if (ENV === 'mainnet')
    options = {
      ...options,
      agent: new https.Agent({
        key: fs.readFileSync(CLIENT.KEY),
        cert: fs.readFileSync(CLIENT.CRT),
        // ca: fs.readFileSync(CA),
        rejectUnauthorized: false,
      }),
    }

  let res = await fetch(
    `${PROT}://${HOST}:${args('--port') || PORT}/v2/${endpoint.replace(
      /^\/*/,
      '',
    )}`,
    options,
  )

  try {
    res = await res.json()
  } catch (e) {}

  if (res.code) throw res
  return await res
}

export default cardanoFetch
