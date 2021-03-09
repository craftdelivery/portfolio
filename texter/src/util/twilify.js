const phoneFormatter = require('phone-formatter')

module.exports = function twilify(phone) {
  return `+1${phoneFormatter.normalize(String(phone))}`
}