import {FlatList, StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import Card from './Card';
import {MPDigitalContext} from '../../../../context/MPDigitalContext';

const data = [0, 1, 2, 3, 4];

const CardListDigital = () => {
  const {magazine} = useContext(MPDigitalContext);
  const toRender = magazine?.slice(0, 5);
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
            dataLength={data.length}
            item={item}
          />
        )}
      />
    </View>
  );
};

export default CardListDigital;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
});
