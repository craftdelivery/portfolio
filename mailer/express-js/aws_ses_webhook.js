import { StatusCodes as http } from 'http-status-codes'
import { rw } from '../../../psql'
import concat from 'concat-stream'
import emailTypes from '../../../config/emailtypes'
import { sesSource } from '../../../utility'

// Local server will not pick up the webhook

// !!!!!!!
// WARNING: DO NOT SEND ADMIN EMAILS HERE!
//          PUT to S3 if err (TODO)

// ASYNC: issues using await due to pipe/concat
export default (req, res) => {
  const {
    CD_CC_EMAIL,
    CD_ERROR_ADMIN_EMAIL,
  } = process.env
  
  req.setEncoding('utf8')
  req.pipe(concat(data => {
    let message
    let otherNotificationType = false
    req.body = data
    const { body, headers } = req
    const snsTopic = headers['x-amz-sns-topic-arn']

    // divide by 1000 to avoid timestamp out of range error
    let xRequestStart = null
    try {
      xRequestStart = parseInt(headers['x-request-start'] / 1000)
    } catch(e) {
      console.log('Invalid x-request-start header')
    }
    
    const parsedBody = JSON.parse(body)
    try {
      message = JSON.parse(parsedBody.Message)
    } catch (e) {
      message = parsedBody.Message
      otherNotificationType = true
    }
    const hookId = parsedBody.MessageId
    const hookType = parsedBody.Type

    let newSubcription = hookType === 'SubscriptionConfirmation'
    if (newSubcription || otherNotificationType) {
      // see confirmation.json for msg structure
      // we are using the outer MessageId, which is not an SES messageId
      // other major fields will be null in these cases
      const otherQ = {
        name: 'aws-ses-callback',
        text: `INSERT
                 INTO some_table (
                        message_id,
                        x_request_start,
                        snstopic,
                        hooktype,
                        raw
                      )
               VALUES ($1, to_timestamp($2), $3, $4, $5)`,
        values: [
          hookId,
          xRequestStart,
          snsTopic,
          hookType,
          body,
        ]
      }
      rw.query(otherQ)
        .then(() => {
          finished(res, http.OK)
        })
        .catch(pgerr1 => {
          console.log(pgerr1)
          finished(res, http.NOT_ACCEPTABLE)
        })
    } else {
      const { mail, notificationType } = message
      const {
        destination,
        commonHeaders,
        messageId,
        source,
      } = mail
  
      const { returnPath, subject } = commonHeaders
  
      // we are stashing the emailtype in returnPath
      // its a quick and dirty way to encode metadata
      // without needing to resort to sendRawEmail
      const emailType = returnPath && returnPath.substring(0, returnPath.indexOf('@'))
  
      // we don't want the cc'd address to show up here:
      // const destinationCsv = destination.join(', ').toString()
      const adminEmails = [CD_CC_EMAIL, CD_ERROR_ADMIN_EMAIL]
      const destEmail = destination.filter(d => d.length > 1 && !adminEmails.includes(d))

      // strip out user name and brackets: Craft Delivery <beer@craftdelivery.ca>
      const sesSender = sesSource.rm(source)

      // table names changed
      const template = `
        INSERT INTO some_table (message_id,
                            notification_type,
                            x_request_start,
                            snstopic,
                            source,
                            destination,
                            subject,
                            message_type,
                            hooktype)
              VALUES ($1, $2, to_timestamp($3), $4, $5, $6, $7, $8, $9)`

      const query = {
        name: 'aws-ses-callback-insert',
        text: template,
        values: [
          messageId,
          notificationType,
          xRequestStart,
          snsTopic,
          sesSender,
          destEmail[0],
          subject,
          emailType,
          hookType,
        ]
      }
      rw.query(query)
        .then(() => {
          res.sendStatus(http.OK)
        })
        .catch(pgerr => {
          console.log(pgerr)
          // TODO
          // USE A LOG BUCKET!@!
          res.sendStatus(http.NOT_ACCEPTABLE)
        })
    }
  }))
}

const finished = (res, status) => {
  res.sendStatus(status)
}