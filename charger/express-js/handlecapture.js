import { ro, rw } from '../../../psql'
import to from 'await-to-js'
import genMail from '../../../email/genmail'
import sesSend from '../../../aws/sessend'
import { adminJson, adminPgJson } from '../../../email'
import { capFirst, orderUrl } from '../../../utility'
import emailTypes from '../../../config/emailtypes'

// we are only using metadata for orderid here
// most of the rest can be obtained via the initial update query
export default async (payload) => {
  const fetchQ = {
    name: 'fetch-capture',
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
    amount,
    captured,
    id,
    metadata,
    payment_method_details,
  } = body.data.object

  // this should be covered under capture.fail
  if (!captured) {
    console.log('handleCapture -- not captured oid: ' + payload.oid)
    return
  }
  const query = {
    name: 'handle-capture',
    text: `
       UPDATE sometable_orders
          SET type='paid',
              confirmed=TRUE
        WHERE chargeid=$1
    RETURNING email,
              firstname,
              id,
              ordertok,
              userid`,
    values: [id]
  }
  const [pgerr, resp] = await to(
    rw.query(query)
  )

  if (pgerr) {
    const msg = `handle capture err on ${id}, order: ${metadata.orderid}`
    console.log(msg)
    adminPgJson(pgerr, msg)
    return
  }

  const result = resp.rows[0]
  const {
    email,
    firstname,
    id: orderid,
    ordertok,
  } = result

  const {
    brand,
    last4,
  } = payment_method_details.card

  const subject = `An payment has been made for order (#${orderid})`
  
  const customerEmail = genMail({
    name: firstname,
    intro: `${subject}. ${capFirst(brand)} Card ending in ${last4}`,
    actions: [
      {
        button: {
          color: 'ok',
          link: orderUrl(ordertok, orderid, email),
          text: 'View Order',
        },
        instructions: `Payment Amount: $${amount / 100}`,
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
    adminJson({ payload, body }, msg)
  }
}