import {TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {theme} from '../../../assets';
import TextInter from '../TextInter';

const Button = ({label, style, flex, type, disabled, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonStyles,
        type === 'secondary' ? styles.secondary : styles.primary,
        flex ? {flex: flex} : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <TextInter
        style={[styles.label, type === 'secondary' && styles.secondaryLabel]}>
        {label}
      </TextInter>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyles: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
  },
  secondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  label: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.inter.medium,
    lineHeight: 22,
  },
  secondaryLabel: {
    color: theme.colors.primary,
  },
});
