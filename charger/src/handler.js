const hCodes = require('http-status-codes')

const http = hCodes.StatusCodes

const {
  API_KEY,
  SECURITY_HEADER,
  STRIPE_SECRET_TEST,
  STRIPE_SECRET,
} = process.env

const stripeTest = require('stripe')(STRIPE_SECRET_TEST)
const stripeProd = require('stripe')(STRIPE_SECRET)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, GET, HEAD, OPTIONS',
  'Access-Control-Allow-Credentials' : true
}

let countUse = 0

// Express will pass in isTest if it determines we are testing stripe charges
// in that case we use test credentials
function getBody(event, context) {
  countUse += 1
  if (!event.headers[SECURITY_HEADER]) {
    return {
      isErr: true,
      statusCode: http.FAILED_DEPENDENCY,
      headers: headers,
      body: JSON.stringify({
        error: 'Auth Not Found',
        connectionCount: countUse,
      }),
    }
  } else if (event.headers[SECURITY_HEADER] !== API_KEY) {
    return {
      isErr: true,
      statusCode: http.PROXY_AUTHENTICATION_REQUIRED,
      headers: headers,
      body: JSON.stringify({
        error: 'Auth Invalid',
        connectionCount: countUse,
      }),
    }
  } else {
    try {
      const body = JSON.parse(event.body)
      return {
        data: body,
        stripe: body.isTest ? stripeTest : stripeProd,
        isErr: false,
        statusCode: http.OK,
      }
    } catch {
      return {
        isErr: true,
        statusCode: http.PRECONDITION_FAILED,
        headers: headers,
        body: JSON.stringify({
          error: 'Body Invalid',
          connectionCount: countUse,
        }),
      }
    }
  }
}

function finalError(e) {
  console.log(e)
  return {
    statusCode: http.INTERNAL_SERVER_ERROR,
    headers: headers,
    body: JSON.stringify({
      error: e.message,
      connectionCount: countUse,
    }),
  }
}

function stripeError(err, status=http.UNPROCESSABLE_ENTITY) {
  return {
    statusCode: status,
    headers: headers,
    body: JSON.stringify({
      errCode: err.code,
      errCharge: err.charge,
      errDeclineCode: err.decline_code,
      errDoc: err.doc_url,
      errType: err.type,
      errMsg: err.message,
      connectionCount: countUse,
    })
  }
}

function stripeResponse(resp) {
  return {
    statusCode: http.OK,
    headers: headers,
    body: JSON.stringify({
      stripeResp: resp,
      connectionCount: countUse,
    })
  }
}

function stripeOk() {
  return {
    statusCode: http.OK,
    headers: headers,
  }
}

module.exports.chargesCapture = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const body = getBody(event, context)
    if (body.isErr) {
      return body
    } else if (!body) {
      throw('No Body')
    } else if (!body.stripe) {
      throw('No Stripe')
    }
    const { data, stripe } = body
    const { chargeId } = data

    try {
      await stripe.charges.capture(chargeId)
      return stripeOk()
    } catch (err) {
      return stripeError(err)
    }

  } catch (e) {
    return finalError(e)
  }
}

module.exports.chargesCreate = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const body = getBody(event, context)
    if (body.isErr) {
      return body
    } else if (!body) {
      throw('No Body')
    } else if (!body.stripe) {
      throw('No Stripe')
    }
    const { data, stripe } = body
    const { payload } = data
    try {
      const resp = await stripe.charges.create(payload)
      return stripeResponse(resp)
    } catch (err) {
      return stripeError(err, http.BAD_REQUEST)
    }
  } catch (e) {
    return finalError(e)
  }
}

module.exports.chargesRetrieve = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const body = getBody(event, context)
    if (body.isErr) {
      return body
    } else if (!body) {
      throw('No Body')
    } else if (!body.stripe) {
      throw('No Stripe')
    }
    const { data, stripe } = body
    const { chargeId } = data

    try {
      const resp = stripe.charges.retrieve(chargeId)
      return stripeResponse(resp)
    } catch (err) {
      return stripeError(err, http.BAD_REQUEST)
    }
  } catch (e) {
    return finalError(e)
  }
}

module.exports.chargesUpdate = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const body = getBody(event, context)
    if (body.isErr) {
      return body
    } else if (!body) {
      throw('No Body')
    } else if (!body.stripe) {
      throw('No Stripe')
    }
    const { data, stripe } = body
    const { payload, chargeId } = data

    try {
      await stripe.charges.update(chargeId, payload)
      return stripeOk()
    } catch (err) {
      return stripeError(err, http.BAD_REQUEST)
    }
  } catch (e) {
    return finalError(e)
  }
}

module.exports.refundsCreate = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const body = getBody(event, context)
    if (body.isErr) {
      return body
    } else if (!body) {
      throw('No Body')
    } else if (!body.stripe) {
      throw('No Stripe')
    }
    const { data, stripe } = body
    const { chargeId } = data
    try {
      await stripe.refunds.create({ charge: chargeId })
    } catch (err) {
      let status
      if(err.code === 'charge_already_refunded') {
        status = http.NOT_FOUND
      } else {
        status = http.BAD_REQUEST
      }
      return stripeError(err, status)
    }
    return stripeOk()
  } catch (e) {
    return finalError(e, countUse)
  }
}