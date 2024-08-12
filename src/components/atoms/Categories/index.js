import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import TextInter from '../TextInter';
import {theme} from '../../../assets';
import {useNavigation} from '@react-navigation/native';

const Categories = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.categories}
      onPress={() => navigation.navigate('MoreNews', {tag: item})}>
      <TextInter style={styles.categoriesLabel}>{item}</TextInter>
    </TouchableOpacity>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categories: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.MPBlue1,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  categoriesLabel: {
    fontSize: 10,
    color: theme.colors.MPBlue1,
  },
});
