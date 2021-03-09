import { rw } from '../../../psql'
import to from 'await-to-js'
import events from './events'

// this will create an endless loop 
export default async (payload) => {
  const query = {
    name: 'update-oid-handle-updated',
    text: `
      update some_table_stripe
         set oid=$1
       where chargeid=$2
         and event=$3'`,
    values: [
      payload.oid,
      payload.chargeid,
      events.chargeSucceeded,
    ]
  }
  const [err] = await to(rw.query(query))
  if (err) {
    console.log(err)
  }
}