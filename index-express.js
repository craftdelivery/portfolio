/*


Express JS app main file snippet

SES webhooks and stripe webhooks should be defined
  - above bodyParser.json()
  - above cors

*/
...
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
