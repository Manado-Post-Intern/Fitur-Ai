import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import Card from '../Card';
import {TextInter} from '../../../../components';
import {theme} from '../../../../assets';

const data = ['Casabaio Resort', 'Mercure Resort', 'Casabaio Resort'];

const TrendingSection = ({item}) => {
  const filteredData = item?.filter(item => item.trending === '1');
  return (
    <View style={styles.container}>
      <TextInter style={styles.title}>Trending hari ini</TextInter>
      <FlatList
        contentContainerStyle={styles.flatList}
        horizontal
        data={filteredData}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={styles.cardContainer}>
            <Card item={item} key={index} type={'primary'} />
          </View>
        )}
      />
    </View>
  );
};

export default TrendingSection;

const styles = StyleSheet.create({
  title: {
    marginLeft: 45,
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.MPGrey2,
  },
  flatList: {
    paddingHorizontal: 14,
  },
  cardContainer: {
    width: 166,
    height: 144,
  },
});
