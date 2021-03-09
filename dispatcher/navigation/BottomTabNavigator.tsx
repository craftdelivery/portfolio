import React from 'react'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import LocationsScreen from '../screens/LocationsScreen'
import InfoScreen from '../screens/InfoScreen'
import LoginScreen from '../screens/LoginScreen'
import {
  BottomTabParamList,
  LocationsParamList,
  InfoParamList,
  LoginParamList,
} from '../types'
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()
  const { details } = useSelector(s => s.user)
  let isLoggedIn = false

  // todo check if token is expired...
  if (details && details.token) {
    isLoggedIn = details.token.t !== null
  }

  const authName = isLoggedIn ? 'Auth' : 'Login'
  const authIcon = isLoggedIn ? 'logout' : 'login'
  return (
    <BottomTab.Navigator
      initialRouteName={authName}
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name={authName}
        component={LoginNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name={authIcon} color={color} />,
        }}
      />
      <BottomTab.Screen
        name='Locations'
        component={LocationsNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name='navigate' color={color} />,
        }}
      />
      <BottomTab.Screen
        name='Info'
        component={InfoNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name='information-circle-outline' color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const LocationsStack = createStackNavigator<LocationsParamList>()
function LocationsNavigator() {
  return (
    <LocationsStack.Navigator>
      <LocationsStack.Screen
        name='LocationsScreen'
        component={LocationsScreen}
        options={{ headerTitle: 'Locations' }}
      />
    </LocationsStack.Navigator>
  )
}

const InfoStack = createStackNavigator<InfoParamList>()
function InfoNavigator() {
  return (
    <InfoStack.Navigator>
      <InfoStack.Screen
        name='InfoScreen'
        component={InfoScreen}
        options={{ headerTitle: 'Info' }}
      />
    </InfoStack.Navigator>
  )
}

const LoginStack = createStackNavigator<LoginParamList>()
function LoginNavigator() {
  const authTitle = 'Device/Login'
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name={authTitle}
        component={LoginScreen}
        options={{ headerTitle: authTitle }}
      />
    </LoginStack.Navigator>
  )
}
