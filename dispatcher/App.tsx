import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { LogBox } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { Provider } from 'react-redux'
import DeviceWrapper from './device/DeviceWrapper'
import NotificationWrapper from './notifications/NotificationWrapper'
import store from './store/reducer'

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <DeviceWrapper />
          <NotificationWrapper />
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  )
}
