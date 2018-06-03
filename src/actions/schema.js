import { schema } from 'normalizr'

export const security = new schema.Entity('security', {}, {idAttribute: 'symbol'})
export const arrayOfSecurities = new schema.Array(security)
