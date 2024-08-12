import {StyleSheet, View} from 'react-native';
import React from 'react';
import Categories from '../../atoms/Categories';

// const categories = ['Pariwisata', 'Daerah', 'Manado'];

const CategoryHorizontal = ({categories}) => {
  return (
    <View style={styles.categoriesContainer}>
      {categories?.map((item, i) => (
        <Categories item={item.name} key={i} />
      ))}
    </View>
  );
};

export default CategoryHorizontal;

const styles = StyleSheet.create({
  categoriesContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 1,
  },
});
