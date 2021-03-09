import { rw } from '../psql'
import axios from 'axios'
import to from 'await-to-js'
import Urls from '../config/urls'
import { StatusCodes as http } from 'http-status-codes'

// we either return MessageId (mid) or null in case of error

// DROP IN Replacement: AXIOS CALL TO NEW SERVERLESS MAILER
// GOAL: remove aws-sdk dep
export default async (data) => {
  let presendId = null
  const {
    body,
    type,
    recipient,
    subject,
  } = data


  // stashing the email is nice to have
  // we can recover the exact html sent to the user
  // this is a nice to have and its not needed
  // awsnotifications can track everything except the actual html content
  const presendQ = {
    name: 'pre-sessend',
    text: `insert into sometable (
                         body,
                         destination,
                         message_type,
                         sender,
                         subject
                       )
                values ($1, $2, $3, $4, $5)
             returning id`,
    values: [
      body,
      recipient,
      type,
      process.env.CD_EMAIL,
      subject,
    ]
  }
  const [presendErr, presendResp] = await to(rw.query(presendQ))
  if (presendErr) {
    console.log(presendErr)
  } else {
    presendId = presendResp.rows[0].id
  }

  const payload = {
    data: body,
    emailType: type,
    dest: recipient,
    subject,
  }
  const [merr, mresp] = await to(
    axios({
      data: payload,
      headers: {
        'SOME-HEADER': process.env.SOME_API_KEY,
      },
      method: 'POST',
      url: Urls.lambdaMailer,
    })
  )
  
  if (merr) {
    console.log(merr)
    if (presendId) {
      if (merr.response && merr.response.status) {
        console.log(merr.response)
        const merrQ = {
          name: 'merr-post-sessend',
          text: `update sometable
                    set status=$1
                  where id=$2`,
          values: [
            merr.response.status,
            presendId,
          ],
        }
        const [merrErr] = await to(rw.query(merrQ))
        if (merrErr) {
          console.log(merrErr)
        }
      } else {
        console.log('merr response not defined')
        const merrQ = {
          name: 'merr-post-sessend',
          text: `update sometable
                    set status=$1
                  where id=$2`,
          values: [
            http.SERVICE_UNAVAILABLE,
            presendId,
          ],
        }
        const [merrErr] = await to(rw.query(merrQ))
        if (merrErr) {
          console.log(merrErr)
        }
      }
    } else {
      console.log('pre-send emails insert failed no presendId')
    }
    throw(merr)
  } else {
    const { data, status } = mresp
    const { mid } = data
    if (presendId) {
      const okQ = {
        name: 'merr-post-sessend',
        text: `update sometable
                  set status=$1,
                      message_id=$2
                where id=$3`,
        values: [
          status,
          mid,
          presendId,
        ],
      }
      const [okErr] = await to(rw.query(okQ))
      if (okErr) {
        console.log(okErr)
      }
    }
    return mid
  }
}