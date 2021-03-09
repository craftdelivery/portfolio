import sender from '../aws/sessend'
import emailTypes from '../config/emailtypes'
import to from 'await-to-js'
import jsonEmail from './jsonemail'

export default async (data, _subject) => {
  let subject = _subject

  if (!_subject) {
    if (data.msg) {
      subject = data.msg
    } else {
      subject = 'Generic Admin Json Emall'
    }
  }
  // emailType of failed message is in data.emailType
  // emailType of admin email is in data.type
  try {
    const body = jsonEmail(data)
    const emailData = {
      body,
      bcc: false,
      recipient: process.env.ERROR_ADMIN_EMAIL,
      subject,
      type: emailTypes.adminJson,
    }
    const [sendErr] = await to(sender(emailData))
    if (sendErr) {
      console.log(sendErr)
    }
  } catch(e) {
    console.log(e.message)
  }
}