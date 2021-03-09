import Mailgen from 'mailgen'
import Urls from '../config/urls'
import buttonColors from '../config/emailbuttoncolors'

// used by genmail.js
export default class Mail {
  /*
  themes: default, salted, neopolitan
 
  TODO: generate order summary table
  https://github.com/eladnava/mailgen#table
  */

  // should we be useing genMail instead???
  // actions can be in an array
  constructor(theme='default') {
    this.mg = new Mailgen({
      theme: theme,
      product: {
        copyright: 'Copyright © Craft Delivery Inc (This email contains no tracking pixels or other such devices)',
        link: 'https://craftdelivery.ca',
        logo: Urls.logo,
        name: 'The Craft Delivery Team',
        Signature: 'Cheers'
      }
    })
    this.btnColors = buttonColors
  }

  setButtonColor = (colorKey) => {
    if (!Object.keys(this.btnColors).includes(colorKey)) {
      return this.btnColors.ok
    }
    return this.btnColors[colorKey]
  }

  html = data => this.mg.generate(data)
}