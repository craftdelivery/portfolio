/*


Express JS app main file snippet

SES webhooks and stripe webhooks should be defined
  - above bodyParser.json()
  - above cors

*/

// postgres notifications
// we turn off local because we don't need 2 responses to these events
pgclient
  .connect()
  .then(() => {
    if (!isLocal) {
      pgclient.on('notification', (msg) => {
        let payload = JSON.parse(msg.payload)
        pgEmitter.emit(msg.channel, payload)
      })
      pgclient
        .query('LISTEN stripe-notification-event')
        .then(() => console.log('OK: LISTEN stripe'))
    }
  })


function PgEmitter() {
  EventEmitter.call(this)
}
util.inherits(PgEmitter, EventEmitter)
const pgEmitter = new PgEmitter

if (!isLocal) {
  pgEmitter.on('stripehooks', (payload) => {
    console.log('PG_NOTIFY: stripehooks TODO handle events here')
    console.log(payload.event)
    switch (payload.event) {
      case stripeEvents.chargeCaptured:
        handleCapture(payload)
        break
      case stripeEvents.chargeRefunded:
        handleRelease(payload)
        break;
      case stripeEvents.chargeUpdated:
        // this will set the oid for charge.succeeded
        handleUpdated(payload)
        break;
      default:
        console.log(payload)
        console.log(`Invalid or unsupported stripe event: ${payload.event}`)
        break
    }
  })
}

const rawParser = bodyParser.raw({type: '*/*'})

// these endpoints are set in the Stripe console on a per key basis
app.post('/stripe-prod', rawParser, (req, res) => {
  handleStripeWebhooks(req, res, STRIPE_WEBHOOK_SECRET)
})
// for test data
app.post('/stripe-test', rawParser, (req, res) => {
  handleStripeWebhooks(req, res, STRIPE_WEBHOOK_SECRET_TEST)
})

app.post('/ses-web-hook', awsSesHook)

app.use(bodyParser.json())

app.use(cors())

// routes...
