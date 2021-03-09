import Mail from '../aws/mail'

// https://github.com/eladnava/mailgen

// generic mail gen
// make sure all callers are using button.text and button.link
// instead of btnText and btnLink...
export default(mail) => {
  const {
    actions,
    email,
    intro,
    name,
    outro='Thank you for choosing Craft Delivery',
    subject,
  } = mail

  let mail = new Mail()

  const emailActions = actions.map(action => {
    const btnColor = mail.setButtonColor(action.button.color)
    return {
      instructions: action.instructions,
      button: {
        color: btnColor,
        text: action.button.text,
        link: action.button.link,
      }
    }
  })

  return mail.html({
    body: {
      name: name || email,
      intro: intro || subject,
      outro,
      action: emailActions,
    }
  })
}