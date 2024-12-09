import {Image, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {IMGGlowBR, IMGGlow, IMGMetaLogo, theme} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import { ActivityIndicator } from 'react-native-paper';

const Splash = () => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    setTimeout(() => {
      console.log('To Splash Screen');
      if (!user) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('HomeTab');
      }
    }, 3000);

    return () => {
      clearTimeout();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
    return () => {
      clearTimeout();
    };
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={IMGMetaLogo} style={styles.logo} />

      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
      {isLoading && (
        <ActivityIndicator
          style={styles.indicator}
          size="small"
          color="#29458e"
        />
      )}
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkBright,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    height: 220,
    resizeMode: 'contain',
  },
  topRightGlow: {
    position: 'absolute',
    top: -250,
    right: 0,
    height: '100%',
    width: '100%',
  },
  bottomRightGlow: {
    position: 'absolute',
    bottom: -220,
    left: 0,
    width: '100%',
    height: '100%',
  },
  indicator: {
    marginTop: 80,
  },
});
