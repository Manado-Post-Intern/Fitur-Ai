import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {TextInter} from '../../../../../../components';
import CheckBox from '../../../../../Home/components/NewsForYou/components/CanalModal/components/Checkbox';
import {theme} from '../../../../../../assets';

const OptionRow = ({item, index, setActive, activeList}) => {
  const handleCheck = () => {
    if (!activeList.includes(item)) {
      setActive([...activeList, item]);
    } else {
      setActive(activeList.filter(x => x !== item));
    }
  };

  return (
    <Pressable
      style={[styles.optionItemContainer, index !== 0 && styles.topBorder]}
      onPress={() => handleCheck()}>
      <TextInter style={styles.optionItem}>{item}</TextInter>
      <CheckBox isChecked={activeList.includes(item)} />
    </Pressable>
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
