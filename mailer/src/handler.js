'use strict';
const aws = require('aws-sdk')
const hCodes = require('http-status-codes')
const addSource = require('./util/addsource')
const http = hCodes.StatusCodes

const charSet = 'UTF-8'

const {
  API_KEY,
  AKID,
  EMAIL,
  SECURITY_HEADER,
  SEC,
} = process.env

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, GET, HEAD, OPTIONS',
  'Access-Control-Allow-Credentials' : true
}

let countUse = 0


// can we share the client?
module.exports.send = async (event, context) => {
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
    aws.config = new aws.Config()
    aws.config.accessKeyId = AKID
    aws.config.secretAccessKey = SEC
    aws.config.region = 'us-east-1'
    const body = JSON.parse(event.body)
    const ReturnPath = `${body.emailType || 'none'}@craftdelivery.ca`
    const params = {
      Destination: {
        ToAddresses: [body.dest]
      },
      Message: {
        Body: {
          Text: {
            Charset: charSet,
            Data: body.data,
          },
          Html: {
            Charset: charSet,
            Data: body.data,
          }
        },
        Subject: {
          Data: body.subject
        }
      },
      ReturnPath: ReturnPath,
      Source: addSource(EMAIL),
    }
  
    const ses = new aws.SES()
    const mailResp = await ses.sendEmail(params)
      .promise()

    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify({
        mid: mailResp.MessageId,
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
