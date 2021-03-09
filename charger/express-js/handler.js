import { rw } from '../../../psql'
import { StatusCodes as http } from 'http-status-codes'
import to from 'await-to-js'
import verSig from '../../../stripe/verifysig'
import testIds from '../../../stripe/testids'
import webhookIps from '../../../stripe/webhook_ips'

// handles unsigned stripe webhooks
// we write to stripehooks table
// pgnotifier will then route event to a handler
// Not handled SignedHooks:
//  - release
export default async (req, res, hookKey) => {
  const { body, headers } = req
  const ip = headers['x-forwarded-for']
  const sig = headers['stripe-signature']

  // a list of IPs provided by stripe
  if (!webhookIps.includes(ip)) {
    console.log('Stripe hook handler: invalid ip')
    res.sendStatus(http.NON_AUTHORITATIVE_INFORMATION)
    return
  }
  const event = verSig(body, sig, hookKey)
  if (!event) {
    res.sendStatus(http.PROXY_AUTHENTICATION_REQUIRED)
    return
  }

  const { data } = event
  if (!data || !data.object) {
    res.sendStatus(http.EXPECTATION_FAILED)
    return
  }
  if (body.id === testIds.eventId) {
    console.log('Stripe hook handler: Test Event')
    res.sendStatus(http.NO_CONTENT)
    return
  }
  const {
    id,
    metadata,
  } = data.object

  const stashQ = {
    name: 'stripehook-generic-handler',
    text: `insert into sometable_ (
                         oid,
                         event,
                         body,
                         chargeid,
                         livemode
                       )
                values ($1, $2, $3, $4, $5)`,
    values: [
      metadata.orderid,
      event.type,
      JSON.stringify(event),
      id,
      event.livemode,
    ]
  }
  const [stashErr] = await to(
    rw.query(stashQ)
  )
  if (stashErr) {
    console.log('Error stashing capture hook body')
    console.log(stashErr)
    res.sendStatus(http.NOT_MODIFIED)
    return
  }
  res.sendStatus(http.OK)
}