import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {IcClosedEye, IcOpenedEye, theme} from '../../../assets';

const TextInput = ({label, placeholder, password = false, isError = false}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      {password ? (
        <>
          {label && <Text style={styles.label}>{label}</Text>}
          <View
            style={[
              styles.passwordContainer,
              isError && styles.passwordContainerError,
            ]}>
            {isError ? (
              <RNTextInput
                style={[
                  styles.passwordTextInput,
                  styles.passwordTextInputError,
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textInputPlaceholder}
                value={isError && 'Password Salah'}
              />
            ) : (
              <RNTextInput
                style={styles.passwordTextInput}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textInputPlaceholder}
                secureTextEntry={isShowPassword}
              />
            )}
            <Pressable onPress={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? <IcOpenedEye /> : <IcClosedEye />}
            </Pressable>
          </View>
        </>
      ) : (
        <>
          {label && <Text style={styles.label}>{label}</Text>}
          <RNTextInput
            style={[styles.textInput, isError && styles.textInputError]}
            value={isError && 'email salah atau belum terdaftar'}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textInputPlaceholder}
          />
        </>
      )}
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: theme.colors.textInputLabel,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.borderGray,
    backgroundColor: theme.colors.textInputFill,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
  },
  textInputError: {
    borderColor: theme.colors.borderError,
    backgroundColor: theme.colors.textInputFillError,
    color: theme.colors.textInputPlaceholderError,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: theme.colors.borderGray,
    backgroundColor: theme.colors.textInputFill,
    borderRadius: 8,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  passwordContainerError: {
    borderColor: theme.colors.borderError,
    backgroundColor: theme.colors.textInputFillError,
  },
  passwordTextInput: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: theme.fonts.inter.regular,
    flex: 1,
  },
  passwordTextError: {
    color: theme.colors.textInputPlaceholderError,
  },
  passwordTextInputError: {
    color: theme.colors.textInputPlaceholderError,
  },
});
