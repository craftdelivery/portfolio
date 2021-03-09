
import Stripe from './stripe'

export default (body, sig, hookKey) => {
  const client = new Stripe()
  const webhooks = client.stripe.webhooks
  try {
    return webhooks.constructEvent(
      body,
      sig,
      hookKey,
    )
  } catch (err) {
    return false
  }
}