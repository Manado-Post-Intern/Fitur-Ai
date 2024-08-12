import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CheckBox from '../../../Home/components/NewsForYou/components/CanalModal/components/Checkbox';
import {theme} from '../../../../assets';

const ModalRow = ({item, filter, index}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{item}</Text>
      <CheckBox isChecked={filter === index ? true : false} />
    </View>
  );
};

export default ModalRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.grey1,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
