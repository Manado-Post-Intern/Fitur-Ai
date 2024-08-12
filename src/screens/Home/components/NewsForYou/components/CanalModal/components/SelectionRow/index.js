import {Pressable, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '../../../../../../../../assets';
import CheckBox from '../Checkbox';

const SelectionRow = ({item, setActive, activeList}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => {
    if (isChecked) {
      setActive(prev => prev.filter(i => i !== item?.name));
    } else {
      setActive(prev => [...prev, item?.name]);
    }
  };

  useEffect(() => {
    activeList?.includes(item?.name) ? setIsChecked(true) : setIsChecked(false);
  }, [activeList]);

  return (
    <Pressable style={styles.container} onPress={handleCheck}>
      <Text style={styles.label}>{item?.name}</Text>
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
    fontSize: 14,
  },
});
