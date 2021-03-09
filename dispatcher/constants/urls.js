import Constants from 'expo-constants'

// we want to fallback to ngrok if available for local testing
// do not use expo start
// use yarn run local

const local = Constants.manifest.extra && Constants.manifest.extra.ngrokUrl
const isLocalEnv = local && __DEV__

const base = 'https://example.com.url.omitted'

const baseUrl = isLocalEnv ? Constants.manifest.extra.ngrokUrl : base

const locBase = `${baseUrl}/some-endpoint-loc`

const urls = {
  device: `${baseUrl}/some-endpoint-device`,
  // PUT: setLoc; GET/uid: get locs
  driverLoc: locBase,
  getLocs: (uid) => `${locBase}/${uid}`,

  // POST: pwd login; PUT: session login
  signin: `${baseUrl}/some-endpoint-signin`,
}

export default urls