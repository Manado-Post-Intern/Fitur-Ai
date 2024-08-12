import {Pressable, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {theme} from '../../../assets';
import CheckBox from './CheckBox';

const SelectionRow = ({item, setActive, activeList}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => {
    if (!isChecked) {
      setActive([...activeList, item]);
    } else {
      setActive(activeList.filter(x => x !== item));
    }
    setIsChecked(!isChecked);
  };

  return (
    <Pressable style={styles.container} onPress={handleCheck}>
      <Text style={styles.label}>{item}</Text>
      <CheckBox isChecked={isChecked} />
    </Pressable>
  );
};

export default SelectionRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.skyBlue,
  },
  label: {
    color: theme.colors.white,
  },
});
