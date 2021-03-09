import { ro, rw } from '../../../psql'
import to from 'await-to-js'
import genMail from '../../../email/genmail'
import sesSend from '../../../aws/sessend'
import { adminJson, adminPgJson } from '../../../email'
import emailTypes from '../../../config/emailtypes'
import { OrderTypes } from '@craft-delivery/cfg/dist/config'

// so this is where the metadata comes in handy
// where there is no need for 2 queries
export default async (payload) => {
  const fetchQ = {
    name: 'fetch-release',
    text: 'select * from some_table_stripe where id=$1',
    values: [payload.id]
  }
  const [fetchErr, fetchResp] = await to (ro.query(fetchQ))

  if (fetchErr) {
    console.log(fetchErr)
    return
  }
  const { body } = fetchResp.rows[0]
  const {
    amount_refunded,
    id,
    metadata,
  } = body.data.object

  // we don't need all of these
  const {
    email,
    firstName,
    orderid,
    userid,
  } = metadata

  const template = `
      UPDATE sometable_orders
        SET type=$1,
            refundamount=$2
      WHERE chargeid=$3
        AND userid=$4
        AND email=$5
        AND id=$6`

  const query = {
    name: 'handle-release',
    text: template,
    values: [
      OrderTypes.refund,
      amount_refunded,
      id,
      userid,
      email,
      orderid,
    ]
  }

  const [pgerr] = await to(rw.query(query))

  if (pgerr) {
    console.log(pgerr)
    const msg = `handle release error on ${id},  order: ${metadata.orderid}`
    adminPgJson(pgerr, msg)
    return
  }
  const subject = `Refund for Order (#${metadata.orderid}) has been sucessfully processed`
  // should we link back to the order?
  const customerEmail = genMail({
    name: firstName,
    intro: subject,
    actions: [
      {
        button: {
          color: 'ok',
          link: 'https://craftdelivery.ca',
          text: 'Goto Craft Delivery',
        },
        instructions: `Amount Refunded: $${amount_refunded / 100}`,
      },
    ]
  })
  const emailData = {
    body: customerEmail,
    recipient: email,
    subject,
    type: emailTypes.checkoutCustomerCancel,
  }
  const [sendErr] = await to(sesSend(emailData))
  if (sendErr) {
    console.log(sendErr)
    const msg = `Authorization conf email not sent for order ${orderid}`
    adminJson({ body, payload }, msg)
  }
}