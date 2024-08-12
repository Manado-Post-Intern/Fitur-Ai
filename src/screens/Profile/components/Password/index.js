import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Gap, TextInter} from '../../../../components';
import {
  IcBlueCheckmark,
  IcClosedEye,
  IcEdit,
  IcOpenedEye,
  theme,
} from '../../../../assets';

const Password = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
}) => {
  const [editPassword, setEditPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return editPassword ? (
    <>
      <View style={styles.container}>
        <TextInter style={styles.label}>Password Lama</TextInter>
        <Gap height={4} />
        <View style={styles.passwordEditContainer}>
          <RNTextInput
            style={styles.textInputEditPassword}
            value={oldPassword}
            secureTextEntry={!showPassword}
            onChangeText={val => setOldPassword(val)}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <IcOpenedEye /> : <IcClosedEye />}
          </Pressable>
        </View>
      </View>
      <View style={[styles.container, styles.noMargin]}>
        <TextInter style={styles.label}>Password Baru</TextInter>
        <Gap height={4} />
        <View style={styles.passwordEditContainer}>
          <RNTextInput
            style={styles.textInputEditPassword}
            value={newPassword}
            secureTextEntry={!showPassword}
            onChangeText={val => setNewPassword(val)}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <IcOpenedEye /> : <IcClosedEye />}
          </Pressable>
        </View>
      </View>
      <Gap height={8} />
      <View style={styles.information}>
        <IcBlueCheckmark />
        <Gap width={4} />
        <TextInter style={styles.informationText}>lebih dari 8 digit</TextInter>
      </View>
      <View style={styles.information}>
        <IcBlueCheckmark />
        <Gap width={4} />
        <TextInter style={styles.informationText}>
          Berisi minimal 1 huruf kapital, 1 karakter khusus, 1 angka
        </TextInter>
      </View>
      <View style={styles.information}>
        <IcBlueCheckmark />
        <Gap width={4} />
        <TextInter style={styles.informationText}>
          Bukan Password sebelumnya
        </TextInter>
      </View>
    </>
  ) : (
    <View style={styles.container}>
      <TextInter style={styles.label}>Password</TextInter>
      <Gap height={4} />
      <View style={styles.passwordContainer}>
        <RNTextInput style={styles.textInputPassword} value={'******'} />
        <Gap width={4} />
        <Pressable
          style={styles.editPassword}
          onPress={() => setEditPassword(true)}>
          <IcEdit />
        </Pressable>
      </View>
    </View>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    marginBottom: 21,
  },
  noMargin: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.grey1,
  },

  passwordContainer: {
    flexDirection: 'row',
  },
  textInputPassword: {
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 10,
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#DFE8F566',
    borderRadius: 8,
    color: theme.colors.grey1,
    flex: 1,
  },
  editPassword: {
    padding: 8,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.MPGrey2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  passwordEditContainer: {
    flexDirection: 'row',
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#DFE8F566',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  textInputEditPassword: {
    margin: 0,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 10,

    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.grey1,
    flex: 1,
  },

  information: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  informationText: {
    fontSize: 10,
    color: '#0961B1',
  },
});
