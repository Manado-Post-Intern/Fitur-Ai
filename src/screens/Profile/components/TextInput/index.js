import {
  Platform,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import React from 'react';
import {Gap, TextInter} from '../../../../components';
import {theme} from '../../../../assets';

const TextInput = ({label, value, setValue, editable = true}) => {
  switch (label) {
    case 'Nama':
      return (
        <View style={styles.container}>
          <TextInter style={styles.label}>{label}</TextInter>
          <Gap height={4} />
          <RNTextInput
            editable={editable}
            style={styles.textInput}
            value={value}
            onChangeText={val => setValue(val)}
          />
        </View>
      );
    case 'Nomor HP':
      return (
        <View style={styles.container}>
          <TextInter style={styles.label}>{label}</TextInter>
          <Gap height={4} />
          <View style={styles.textInputNumberContainer}>
            <TextInter style={styles.code}>+62</TextInter>
            <RNTextInput
              placeholder="-------------"
              style={styles.textInputNumber}
              value={value}
              onChangeText={val => setValue(val)}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      );

    default:
      return (
        <View style={styles.container}>
          <TextInter style={styles.label}>{label}</TextInter>
          <Gap height={4} />
          <RNTextInput style={styles.textInput} value={value} />
        </View>
      );
  }
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 21,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.grey1,
  },
  textInput: {
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 10,
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#DFE8F566',
    borderRadius: 8,
    color: theme.colors.grey1,
  },

  textInputNumberContainer: {
    flexDirection: 'row',
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#DFE8F566',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  code: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.bold,
    color: theme.colors.grey1,
  },
  textInputNumber: {
    margin: 0,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 10,

    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.grey1,
  },
});
