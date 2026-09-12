import React from 'react';
import {Provider} from 'react-redux'

import App from './App'
import {PersistGate} from 'redux-persist/integration/react'
import {ActivityIndicator, View} from 'react-native';
import { persistor, store } from './redux/store';
import NetworkProvider from './context/NetworkProvider';

export default function Index() {

  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#4A3428" />
          </View>
        } 
        persistor={persistor}
      >
        <NetworkProvider>
          <App/>
        </NetworkProvider>
      </PersistGate>
    </Provider>
  );
}
