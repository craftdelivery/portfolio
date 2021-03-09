import * as React from 'react'
import { StyleSheet } from 'react-native'
import {
  List,
} from 'react-native-paper'
import Constants from 'expo-constants'
import { useSelector } from 'react-redux'
import { Text, View } from '../components/Themed'
import  {
  Agree,
  Close,
  CheckToggle,
} from '../icons'
import valToken from '../util/valtoken'

const {
  Item,
  Section,
  Subheader,
} = List


const {
  builtAt,
  devVersion,
 } = Constants.manifest.extra

const Info = (props) => (
  <Text style={props.title ? styles.infoTitle : styles.info}>
    {props.children}
  </Text>
)
const ListItem = (props) => (
  <Item {...props} style={styles.listItem} />
)

const calcAge = (ts) => {
  if (!ts) return 0
  const diff = ((Date.now() - ts) / 1000/ 60) * 100 / 100
  return Number(diff.toFixed(1))
}

export default function InfoScreen() {
  const device = useSelector(s => s.device)
  const loc = useSelector(s => s.loc)
  const user = useSelector(s => s.user)

  let expiary = ''
  let exp
  if (user.details?.token) {
    const { token } = user.details
    exp = valToken(token.exp, token.iat)
    if (exp) {
      expiary = `${exp.valmins} mins`
    }
  }

  return (
    <View style={styles.container}>
      <Section style={styles.sectionTop}>
        <ListItem
          title='Released'
          right={() => <Info>{builtAt}</Info>}
        />
        <ListItem
          title='Version'
          right={() => <Info>{devVersion}</Info>}
        />
      </Section>
      <Section>
        <Subheader style={styles.title}>
          User ID: <Info title>{user.details?.userId}</Info> <Info>{user.details?.isAdmin ? 'Admin' : 'Driver'}</Info>
        </Subheader>
        <ListItem
          title='Email'
          right={() => <Info>{user.details?.email}</Info>}
        />
        <ListItem
          title='Login Status'
          right={() => <Info>{user.loginStatus || '---'}</Info>}
        />
        <ListItem
          title='Token Expiary'
          right={() => <Info>{expiary}</Info>}
        />
      </Section>
      <Section>
        <Subheader style={styles.title}>
          Device ID: <Info title>{device.id}</Info>
        </Subheader>
        <ListItem
          title='Name / Model'
          right={() => <Info>{device.name} / {device.info?.modelName}</Info>}
        />
        <ListItem
          title='Beacon'
          right={() => <CheckToggle checked={device.isBeacon} /> }
        />
        <ListItem
          title='Notifier'
          right={() => <CheckToggle checked={device.isNotifier} /> }
        />
        <ListItem
          title='Push Token'
          right={() => <CheckToggle checked={!!device.pushToken} /> }
        />
      </Section>
      <Section>
        <Subheader style={styles.title}>
          Location
        </Subheader>
        <ListItem
          title='Locations'
          right={() => <Info>{loc.locs?.filter(l => l.deviceid === device.id).length}</Info>}
        />
        <ListItem
          title='Init'
          right={() => <CheckToggle checked={loc.gotInitPositions} /> }
        />
        <ListItem
          title='Previous'
          right={() => <CheckToggle checked={loc.gotPrevPositions} /> }
        />
        <ListItem
          title='Got Last Watch Pos At:'
          right={() => (
            <Info>
              {loc.gotWatchPositionTime + ' '}
              {calcAge(loc.gotWatchPositionAt) + 'm ago' || '---'}
            </Info>
          )
          }
        />
        <ListItem
          title='Watch Pos Count'
          right={() => <Info>{loc.watchPosCount}</Info>}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoTitle: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },
  listItem: {
    marginBottom: -12,
    marginTop: -12,
  },
  section: {
    marginBottom: -15,
    // marginTop: -5,
    paddingTop: 0,
  },
  sectionTop: {
    marginBottom: -5,
  },
  title: {
    marginBottom: -10,
    marginTop: -10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
