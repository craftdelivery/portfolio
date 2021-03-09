'use strict';
const twilify = require('./util/twilify')
const hCodes = require('http-status-codes')

const http = hCodes.StatusCodes

const {
  API_KEY,
  SECURITY_HEADER,
  SID,
  TOKEN,
} = process.env


const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, GET, HEAD, OPTIONS',
  'Access-Control-Allow-Credentials' : true
}

let countUse = 0

// send just spins out the raw send capability
// TODO: helper functions that spin out specific messages
module.exports.send = async (event, context) => {
  const client = require('twilio')(
    SID,
    TOKEN,
  )
  let statusCode = http.OK
  context.callbackWaitsForEmptyEventLoop = false
  countUse += 1
  if (!event.headers[SECURITY_HEADER]) {
    statusCode = http.FAILED_DEPENDENCY
    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify({
        error: 'Auth Not Found',
        connectionCount: countUse,
      }),
    }
  } else if (event.headers[SECURITY_HEADER] !== API_KEY) {
    statusCode = http.PROXY_AUTHENTICATION_REQUIRED
    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify({
        error: 'Auth Invalid',
        connectionCount: countUse,
      }),
    }
  }
  try {
    const body = JSON.parse(event.body)
    
    const fromNum = twilify(TEL)
    const toNum = twilify(body.to)

    const smsResp = await client.messages.create({
      from: fromNum,
      to: toNum,
      body: body.msg,
      statusCallback: body.statusCallback,
    })
    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify({
        sid: smsResp.sid,
        connectionCount: countUse,
      }),
    }
  } catch (e) {
    console.log(e)
    statusCode = http.INTERNAL_SERVER_ERROR
    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify({
        error: e.message,
        connectionCount: countUse,
      }),
    }
  }
}
