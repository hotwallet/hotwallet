import Idiot from 'idiot'
import * as config from '../config'
import SocketClient from './SocketClient'

const client = new Idiot({
  baseUrl: config.serverUrl
})

// client.setAccessToken(token)

client.socket = new SocketClient()
client.socket.start()

export default client
