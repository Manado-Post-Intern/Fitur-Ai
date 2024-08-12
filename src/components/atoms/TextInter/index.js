import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {theme} from '../../../assets';

/**
 *
 * @param {children, style} props
 * @returns
 * Basic text component with inter font family.
 *
 * To do {
 *  textProps doesn't seems to be working without typescript
 * }
 */
const TextInter = props => {
  const {children, style, ...textProps} = props;

  return (
    <Text style={[styles.text, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default TextInter;

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.fontDark,
    fontSize: 12,
  },
});
