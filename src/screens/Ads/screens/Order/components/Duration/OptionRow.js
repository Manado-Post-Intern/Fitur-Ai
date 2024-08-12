import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TextInter} from '../../../../../../components';
import {theme} from '../../../../../../assets';

const OptionRow = ({item, index}) => {
  return (
    <View style={[styles.optionItemContainer, index !== 0 && styles.topBorder]}>
      <TextInter style={styles.optionItem}>{item}</TextInter>
    </View>
  );
};

export default OptionRow;

const styles = StyleSheet.create({
  optionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBorder: {
    borderTopColor: theme.colors.MPWhite,
    borderTopWidth: 1,
  },
});
