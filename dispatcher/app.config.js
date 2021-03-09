const fs = require('fs')

let ngrokUrl = null
if (process.env.EXPO_NGROK === '1') {
  ngrokUrl = fs.readFileSync('./NGROK_URL', { encoding: 'utf8'})
}

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      builtAt: new Date().toDateString(),
      ngrokUrl,
    }
  }
}