import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import debug from 'debug'

import config from '../../../config'

const { ENV, HOST, CLIENT, CA } = config

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

  //  log(`${HOST}/${endpoint.replace(/^\/*/, '')}`)
  // log(options)

  let res = await fetch(`${HOST}/${endpoint.replace(/^\/*/, '')}`, options)

  try {
    res = await res.json()
  } catch (e) {}

  if (res.code) throw res // new Error(`${res.code} | ${res.message}`)
  return await res
}

export default cardanoFetch
