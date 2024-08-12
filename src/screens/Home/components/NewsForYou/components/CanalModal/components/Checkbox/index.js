import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IcCheckBlue, theme} from '../../../../../../../../assets';

const CheckBox = ({isChecked}) => {
  return (
    <View style={[styles.container, isChecked && styles.checked]}>
      {isChecked && <IcCheckBlue />}
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    width: 17,
    height: 17,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.colors.skyBlue,
  },
  checked: {
    backgroundColor: 'rgba(58, 184, 255, 0.2);',
  },
});
