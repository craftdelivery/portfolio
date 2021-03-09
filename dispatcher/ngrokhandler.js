const fs = require('fs')
const axios = require('axios')

axios.get('http://127.0.0.1:4040/api/tunnels')
.then(resp => {
  const httpsTunnel = resp.data.tunnels.find(t => t.proto==='https')
  const url = httpsTunnel.public_url
  fs.writeFileSync('./NGROK_URL', url)
})
.catch(e => {
  console.log('START NGROK in another window: ngrok http 3001')
  // exit err code so && in package json does not execute the expo start command
  process.exit(2)
})