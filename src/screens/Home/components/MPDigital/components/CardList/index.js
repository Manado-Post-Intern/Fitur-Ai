import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import Card from './Card';

const data = [0, 1, 2, 3, 4];

const CardList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        overScrollMode="never"
        contentContainerStyle={styles.contentContainerStyle}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Card key={index} index={index} dataLength={data.length} />
        )}
      />
    </View>
  );
};

export default CardList;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
});
