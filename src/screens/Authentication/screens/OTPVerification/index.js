import {Image, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGMPTextPrimary, theme} from '../../../../assets';
import {Button, Gap, TextInter} from '../../../../components';
import {OTPInput} from '../../components';

const OTPVerification = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image style={styles.MPLogo} source={IMGMPTextPrimary} />

        <TextInter style={styles.verification}>Verifikasi</TextInter>
        <TextInter style={styles.subText}>
          masukan kode OTP yang dikirimkan ke
        </TextInter>
        <TextInter style={styles.email}>anda@mail.com</TextInter>

        <Gap height={43} />

        <View style={styles.textInputContainer}>
          <OTPInput />
          <OTPInput />
          <OTPInput />
          <OTPInput />
        </View>
        <Gap height={8} />
        <TextInter style={styles.timer}>
          masukan kode sebelum waktu habis{' '}
          <TextInter style={styles.countdown}>24</TextInter>
        </TextInter>
        <Gap height={8} />
        <Pressable>
          <TextInter style={styles.resendLabel}>Kirim Ulang OTP</TextInter>
        </Pressable>

        <Gap height={43} />

        <Button label="Verifikasi" />
      </View>
    </SafeAreaView>
  );
};

export default OTPVerification;

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

  verification: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
  },
  subText: {
    fontSize: 12,
    color: theme.colors.grey1,
  },
  email: {
    fontSize: 12,
    fontFamily: theme.fonts.inter.bold,
    color: theme.colors.grey1,
  },
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  timer: {
    color: theme.colors.grey1,
  },
  countdown: {
    fontFamily: theme.fonts.inter.bold,
  },
  resendLabel: {
    fontFamily: theme.fonts.inter.bold,
    color: theme.colors.MPBlue1,
  },
});
