import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGMPTextPrimary, theme} from '../../../../assets';
import {Button, Gap, TextInter} from '../../../../components';
import {Requirements, TextInput} from '../../components';

const NewPassword = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image style={styles.MPLogo} source={IMGMPTextPrimary} />

        <TextInter style={styles.mainInfo}>Buat Password Baru</TextInter>
        <Gap height={8} />
        <TextInter style={styles.subInfo}>
          Password harus berbeda dengan yang sebelumnya
        </TextInter>

        <Gap height={56} />

        <TextInput label="Password" placeholder="******" password />
        <Gap height={16} />
        <TextInput
          label="Konfirmasi Ulang Password"
          placeholder="******"
          password
        />
        <Gap height={16} />

        <Requirements text="lebih dari 8 digit" />
        <Requirements
          text="Berisi minimal 1 huruf kapital, 1 karakter khusus, 1 angka"
          isWrong
        />
        <Requirements text="Bukan Password sebelumnya" />

        <Button label="Simpan" />
      </View>
    </SafeAreaView>
  );
};

export default NewPassword;

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

  mainInfo: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
  },
  subInfo: {
    fontSize: 14,
    color: theme.colors.grey1,
    textAlign: 'center',
  },
});
