import React, { useReducer } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux'
import EditScreenInfo from '../components/EditScreenInfo'
import { DataTable } from 'react-native-paper'

// we can add Pagination...
const {
  Cell,
  Header,
  Row,
  Title,
} = DataTable

export default function LocationsScreen() {
  const loc = useSelector(s => s.loc)
  const device = useSelector(s => s.device)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <DataTable>
          <Header>
            <Title style={styles.idCell}>
              ID
            </Title>
            <Title>
              Time
            </Title>
            <Title>
              km/h
            </Title>
            <Title>
              pos
            </Title>
          </Header>
          {
            !loc.locs ? null : (
              loc.locs
              .filter(l => l.deviceid === device.id)
              .map((pos, i) => {
                const {
                  id,
                  date,
                  time,
                  kmh,
                  lat,
                  lng,
                } = pos
                return (
                  <Row key={`${id}_${i}`}>
                    <Cell style={styles.idCell}>
                      {id}
                    </Cell>
                    <Cell>
                      <View>
                        <Text>
                          {date}
                          {"\n"}
                          {time}
                        </Text>
                      </View>
                    </Cell>
                    <Cell>
                      {Number.parseFloat(kmh).toFixed(2)}
                    </Cell>
                    <Cell>
                      <View>
                        <Text>
                         {lat}
                         {"\n"}
                         {lng}
                        </Text>
                      </View>
                    </Cell>
                  </Row>
                )
              })
            )
          }
        </DataTable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  idCell: {
    maxWidth: 32,
  },
  medCell: {
    maxWidth: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 2,
  },
  separator: {
    marginVertical: 3,
    height: 1,
    width: '98%',
  },
});
