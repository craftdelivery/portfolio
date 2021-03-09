//https://www.npmjs.com/package/stripe

export default class StripeWrapper {
  constructor() {
    this.pub_prod = process.env.STRIPE_PUB
    this.secret_prod = process.env.STRIPE_SECRET
    this.pub_test = process.env.STRIPE_PUB_TEST
    this.secret_test = process.env.STRIPE_SECRET_TEST

    this.stripe = require('stripe')(this.secret_test)
  }
}
