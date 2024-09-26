/* eslint-disable prettier/prettier */

import {StyleSheet, Alert, Linking, BackHandler, AppState} from 'react-native';
import React, {useEffect, useRef} from 'react';
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
import VersionCheck from 'react-native-version-check';

GoogleSignin.configure({
  webClientId:
    '782626479856-89khocqerprpe29tscrpvdn5vb8ghan0.apps.googleusercontent.com',
});

const App = () => {
  const latestVersion = '2.1.1'; // akan diganti dengan link dinamis
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.mp.manadopost&pcampaignid=web_share';
  const appState = useRef(AppState.currentState);

  const storeSession = async detail => {
    try {
      await EncryptedStorage.setItem('detail', JSON.stringify(detail));
    } catch (error) {
      console.log(error);
    }
  };

  const checkForSpecificVersion = async () => {
    try {
      const currentVersion = await VersionCheck.getCurrentVersion();

      if (currentVersion !== latestVersion) {
        Alert.alert(
          'Update Required',
          "You're using older version. Please update to the latest version.",
          [
            {
              text: 'Update Now',
              onPress: () => {
                Linking.openURL(playStoreUrl)
                  .catch(err => console.error('Failed to open URL', err))
                  .finally(() => {
                    BackHandler.exitApp();
                  });
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.log('Error checking version:', error);
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

    checkForSpecificVersion();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkForSpecificVersion();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <TokenProvider>
        <AdsProvider>
          <MPDigitalProvider>
            <GestureHandlerRootView style={styles.gestureHandlerRootView}>
              <BottomSheetModalProvider>
                <NavigationContainer>
                  <Routes />
                </NavigationContainer>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </MPDigitalProvider>
        </AdsProvider>
      </TokenProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
});
