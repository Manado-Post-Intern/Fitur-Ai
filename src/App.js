import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import axios from 'axios';
import {auth as promediaAuth, authConfig, authData} from './api';
import EncryptedStorage from 'react-native-encrypted-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AuthProvider} from './context/AuthContext';
import {AdsProvider} from './context/AdsContext';
import {MPDigitalProvider} from './context/MPDigitalContext';
import {TokenProvider} from './context/TokenContext';
import PersistentText from './components/atoms/PersistenText';
import {SnackbarNotification} from './components';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SnackbarProvider} from './context/SnackbarContext';
import {
  ErrorNotificationProvider,
  useErrorNotification,
} from './context/ErrorNotificationContext'; // Import context
import ErrorNotification from './components/atoms/ErrorNotification'; // Import komponen notifikasi

GoogleSignin.configure({
  webClientId:
    '782626479856-89khocqerprpe29tscrpvdn5vb8ghan0.apps.googleusercontent.com',
});

const App = () => {
  const storeSession = async detail => {
    try {
      await EncryptedStorage.setItem('detail', JSON.stringify(detail));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axios
      .post(promediaAuth, authData, authConfig)
      .then(response => {
        const session = response.data.data.detail;
        storeSession(session);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorNotificationProvider>
        <AuthProvider>
          <TokenProvider>
            <AdsProvider>
              <MPDigitalProvider>
                <SnackbarProvider>
                  <GestureHandlerRootView style={styles.gestureHandlerRootView}>
                    <BottomSheetModalProvider>
                      <NavigationContainer>
                        <View style={styles.container}>
                          <Routes />
                          <SnackbarNotification />
                          <ErrorNotification />
                        </View>
                      </NavigationContainer>
                    </BottomSheetModalProvider>
                  </GestureHandlerRootView>
                </SnackbarProvider>
              </MPDigitalProvider>
            </AdsProvider>
          </TokenProvider>
        </AuthProvider>
      </ErrorNotificationProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
