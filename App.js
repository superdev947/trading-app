import React, { useEffect, useMemo, useState } from 'react'
import i18n from 'i18n-js'
import { LogBox, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as Localization from 'expo-localization'
import { NativeBaseProvider } from "native-base"
import Navigation from './src/navigation'
import { COLOR, LAYOUT, LocalizationContext } from './src/constants'
import { store, persistor } from './src/redux/Store'
import { useApi } from './src/redux/services'
import { Loading } from './src/components'

LogBox.ignoreLogs(LAYOUT.Warning)

const App = () => {
  const Api = useApi()
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState(Localization.locale.search(/-|_/) !== -1 ? Localization.locale.slice(0, 2) : Localization.locale)
  i18n.locale = locale
  i18n.fallbacks = true

  const localizationContext = useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  )

  useEffect(() => {
    Api.LoadLanguageWord().then(res => {
      i18n.translations = res.data
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.log(error.message)
    })
  }, [])

  return (
    <LocalizationContext.Provider value={localizationContext}>
      <NativeBaseProvider config={LAYOUT.config} theme={LAYOUT.theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={COLOR.blueColor7}
            />
            {
              loading ? <Loading color='#fff' /> : <Navigation />
            }
          </PersistGate>
        </Provider>
      </NativeBaseProvider>
    </LocalizationContext.Provider>
  )
}

export default App