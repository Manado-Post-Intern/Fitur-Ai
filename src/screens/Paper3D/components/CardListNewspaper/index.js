import {FlatList, StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import Card from './Card';
import {MPDigitalContext} from '../../../../context/MPDigitalContext';

const data = [0, 1, 2, 3, 4];

const CardListNewspaper = () => {
  const {newsPaper} = useContext(MPDigitalContext);
  const toRender = newsPaper?.slice(0, 5);
  return (
    <View style={styles.container}>
      <FlatList
        overScrollMode="never"
        contentContainerStyle={styles.contentContainerStyle}
        data={toRender}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Card
            key={index}
            index={index}
            item={item}
            dataLength={data.length}
          />
        )}
      />
    </View>
  );
};

export default CardListNewspaper;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
});
