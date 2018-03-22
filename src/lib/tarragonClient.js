import Idiot from 'idiot'
import * as config from '../config'

const client = new Idiot({
  baseUrl: config.serverUrl
})

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiOTAwYWQxOWUtN2MxNi00NmFjLTlkODctYTg0Y2ExNmJlNGE0IiwiZXhwIjoxNTIzNTAwNzYwLCJpYXQiOjE1MjA5MDg3NjB9.anAQ6Q26Ug9lVrMiy-0wnSbgYglViwe2CB8ddtqnEgE'

client.setAccessToken(token)

export default client
