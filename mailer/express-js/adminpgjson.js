import emailTypes from '../config/emailtypes'
import pgErrors from 'pg-error-constants'
import sender from '../aws/sessend'
import jsonEmail from './jsonemail'
import to from 'await-to-js'

export default async (err, _subject) => {
  let subject = _subject
  if (!_subject) {
    if (!err.msg) {
      subject = 'Generic pg error'
    } else {
      subject = err.msg
    }
  }
  
  if (err.pgerr && err.pgerr.code) {
    const { code } = err.pgerr
    if (!pgErrors[code]) {
      err.pgerr.errorCodeTranslation = 'ERROR_CODE_NOT_FOUND'
    } else {
      err.pgerr.errorCodeTranslation = pgErrors[code]
    }
  }
  try {
    const body = jsonEmail(err)
    const emailData = {
      body,
      bcc: false,
      recipient: process.env.CD_ERROR_ADMIN_EMAIL,
      subject,
      type: emailTypes.adminPg,
    }
    const [sendErr] = await to(sender(emailData))
    if (sendErr) {
      console.log(sendErr)
    }
  } catch(e) {
    console.log(e.message)
    // todo fallback to SMS to admin
  }
}