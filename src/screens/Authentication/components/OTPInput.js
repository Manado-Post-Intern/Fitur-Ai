import {StyleSheet, TextInput} from 'react-native';
import React from 'react';
import {theme} from '../../../assets';

const OTPInput = () => {
  return <TextInput style={styles.textInput} maxLength={1} />;
};

export default OTPInput;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: theme.colors.otpInput.fill,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.otpInput.border,
    width: 50,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: theme.colors.MPBlue1,
    fontSize: 16,
    fontFamily: theme.fonts.inter.medium,
  },
});
