import {Image, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {IMGGlowBR, IMGGlow, IMGMetaLogo, theme} from '../../assets';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      console.log('To Splash Screen');
      navigation.replace('Onboarding');
    }, 1500);

    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={IMGMetaLogo} style={styles.logo} />

      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlow} style={styles.topRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
      <Image source={IMGGlowBR} style={styles.bottomRightGlow} />
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
});
