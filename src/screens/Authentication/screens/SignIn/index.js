import {Image, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {IMGMPTextPrimary, theme} from '../../../../assets';
import {SocialSignIn, TextInput} from '../../components';
import {Button, Gap, TextInter} from '../../../../components';

const SignIn = () => {
  const navigation = useNavigation();

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignIn = () => {
    console.log('handle sign in');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image style={styles.MPLogo} source={IMGMPTextPrimary} />
        <TextInput
          label="Email"
          placeholder="masukkan email disini"
          /**
           * isError is used to activate error state
           */
          // isError={true}
        />

        <Gap height={21} />

        <TextInput
          label="Password"
          placeholder="******"
          password
          /**
           * isError is used to activate error state
           */
          // isError={true}
        />

        <Gap height={4} />

        <View style={styles.forgotPasswordContainer}>
          <Pressable onPress={handleForgotPassword}>
            <TextInter style={styles.forgotPassword}>Lupa Password ?</TextInter>
          </Pressable>
        </View>

        <Gap height={21} />

        <Button label="Masuk" onPress={handleSignIn} />

        <Gap height={21} />

        <TextInter>Atau masuk dengan</TextInter>
        <Gap height={4} />
        <SocialSignIn type="facebook" />
        <Gap height={8} />
        <SocialSignIn type="google" />
        <Gap height={8} />
        <SocialSignIn type="apple" />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 72,
    paddingTop: '10%',
  },
  MPLogo: {
    width: '90%',
    resizeMode: 'contain',
    marginBottom: 64,
  },

  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  forgotPassword: {
    color: theme.colors.MPBlue0,
    fontSize: 11,
    fontFamily: theme.fonts.inter.medium,
  },

  signInButton: {
    width: '100%',
    backgroundColor: theme.colors.MPBlue2,
    height: 51,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.fontLight,
  },
});
