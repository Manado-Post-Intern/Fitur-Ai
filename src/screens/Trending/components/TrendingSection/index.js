import {StyleSheet, View} from 'react-native';
import React from 'react';
import {More, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import Card from '../Card';

const data = [0, 1, 2, 3, 4];

const TrendingSection = ({item}) => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>Trending</TextInter>
      </View>
      {item?.map((item, i) => (
        <Card item={item} key={i} number={i + 1} />
      ))}
      {/* <More /> */}
    </View>
  );
};

export default TrendingSection;

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: theme.colors.MPGrey2,
    fontWeight: '700',
    marginLeft: 16,
  },
});
