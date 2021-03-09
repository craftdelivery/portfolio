const bump = require('./version')
async function update() {
    await bump('app.json', {
      entry: 'devVersion',
      patch: 1,
      spaces: 2,
    })
}
update()