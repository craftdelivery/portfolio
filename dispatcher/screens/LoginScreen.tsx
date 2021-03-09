import React, {
  useEffect,
  useState,
} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import {
  Button,
  TextInput,
} from 'react-native-paper'
import login from '../rest/login'
import logout from '../rest/logout'
import setBeaconNotifier from '../rest/setbeaconnotifier'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusCodes as http } from 'http-status-codes'
import locationHandler from '../location/locationhandler'

export default function LoginScreen() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [loginWithStash, setLoginWithStash] = useState(false)
  const device = useSelector(s => s.device)
  const {
    loginStatus,
    loginInProgress,
    details,
  } = useSelector(s => s.user)
  
  useEffect(() => {
    async function getStash() {
      try {
        const jsonValue = await AsyncStorage.getItem('auth')
        const auth = jsonValue != null ? JSON.parse(jsonValue) : null
        if (auth) {
          setEmail(auth.email)
          setPwd(auth.pwd)
          setLoginWithStash(true)
        }
      } catch(e) {
        console.log('Error getting stashed auth')
        console.log(e)
      }
    }
    getStash()
  }, [loginStatus])

  const signin = () => {
    const payload = {
      device,
      email,
      pwd,
      isPwdMd5: loginWithStash,
    }
    login(dispatch, payload, locationHandler)
  }

  const signout = () => {
    logout(dispatch, details)
  }

  const reset = () => {
    setEmail('')
    setPwd('')
    setLoginWithStash(false)
    AsyncStorage.removeItem('auth')
      .catch(e => {
        console.log(e)
        console.log('Error removing stashed auth')
      })
   }

  const setNotify = () => {
    setBeaconNotifier(dispatch, {
      device,
      isBeacon: false,
      uid: details.userId,
    })

  }

  const setBeacon = () => {
    setBeaconNotifier(dispatch, {
      device,
      isBeacon: true,
      uid: details.userId,
    })
  }
  if (!device.info) {
    return (
      <View>
        <Text>
          Getting Device Info...
        </Text>
      </View>
    )
  }
  if (loginStatus && loginStatus === http.OK) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.device}>
            <Text>
              Email: {details?.email}
            </Text>
            <View style={styles.btnControls}>
              <Text>
                Device Beacon:
                {
                  device.isBeacon ? (
                    <Text style={styles.colOn}>
                      On
                    </Text>
                  ): (
                    <Text style={styles.colOff}>
                      Off
                    </Text>
                  )
                }
              </Text>
              {
                device.isBeacon ? (
                  <Button
                    style={styles.btn}
                    icon='close'
                    mode='outlined'
                    color='grey'
                    onPress={setBeacon}
                  >
                    Turn Off Beacon
                  </Button>
                ) : (
                  <Button
                    style={styles.btn}
                    icon='map'
                    mode='outlined'
                    color='blue'
                    onPress={setBeacon}
                  >
                    Turn On Beacon
                  </Button>
                )
              }
            </View>
            <View style={styles.btnControls}>
              <Text>
                Device Notifier:
                {
                  device.isNotifier ? (
                    <Text style={styles.colOn}>
                      On
                    </Text>
                  ): (
                    <Text style={styles.colOff}>
                      Off
                    </Text>
                  )
                }
              </Text>
              {
                device.isNotifier ? (
                  <Button
                    style={styles.btn}
                    icon='close'
                    mode='outlined'
                    color='grey'
                    onPress={setNotify}
                  >
                    Turn Off Notifier
                  </Button>
                ) : (
                  <Button
                    style={styles.btn}
                    icon='map'
                    mode='outlined'
                    color='blue'
                    onPress={setNotify}

                  >
                    Turn On Notifier
                  </Button>
                )
              }
            </View>
          </View>
          <Text style={styles.btnSpan}>
            <Button
              style={styles.btn}
              icon='account'
              mode='outlined'
              onPress={signout}
              disabled={loginInProgress || !email.length || !pwd.length}
            >
              Logout
            </Button>
          </Text>
        </View>
      </View>
    )
  }

  if (loginWithStash) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>
            Login with {email}
          </Text>
          {
            __DEV__ ? (
              <Text>
                email: {email}
                {'\n'}
                pwd: {pwd}
              </Text>
            ) : null
          }
          <View style={styles.row}>
            <Text style={styles.btnSpan}>
              <Button
                color='orange'
                style={styles.btn}
                icon='close-box-outline'
                mode='outlined'
                onPress={reset}
                disabled={loginInProgress}
              >
                Reset
              </Button>
            </Text>
            <Text style={styles.btnSpan}>
              <Button
                style={styles.btn}
                icon='account'
                mode='outlined'
                onPress={signin}
                disabled={loginInProgress || !email.length || !pwd.length}
              >
                Login
              </Button>
            </Text>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>
          Login
        </Text>
        <TextInput
          style={styles.input}
          label='Email'
          value={email}
          onChangeText={v => setEmail(v.toLowerCase().trim())}
        />
        <TextInput
          style={styles.input}
          label='Password'
          value={pwd}
          onChangeText={v => setPwd(v)}
        />
        <Button
          style={styles.btn}
          icon='account'
          mode='outlined'
          onPress={signin}
        >
          Submit
        </Button>
      </View>
    </View>
  )
}
const width = Dimensions.get('window').width
const useColMin = 500

const styles = StyleSheet.create({
  btn: {
    width: 250,
    textTransform: 'none',
  },
  btnControls: {
    marginTop: 20,
  },
  btnSpan: {
    margin: 15,
  },
  colOn: {
    color: 'green',
    fontWeight: 'bold',
  },
  colOff: {
    color: 'red',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  device: {
    margin: 20,
  },
  inner: {
    flex: 1,
    margin: 20,
  },
  input: {
    width: 350,
    marginBottom: 20,
  },
  row: {
    flex: 1,
    flexDirection: width < useColMin ? 'column' : 'row',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
