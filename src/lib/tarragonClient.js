import Idiot from 'idiot'
import * as config from '../config'

const client = new Idiot({
  baseUrl: config.serverUrl
})

// client.setAccessToken(token)

export default client
