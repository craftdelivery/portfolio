const PREFIX = 'Craft Delivery <'

module.exports = function addSource(email) {
  return `${PREFIX}${email}>`
}