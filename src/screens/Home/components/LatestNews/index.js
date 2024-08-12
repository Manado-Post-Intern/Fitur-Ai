import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, More, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import {Card} from './components';

// const data = [0, 1, 2, 3];

const LatestNews = ({item}) => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>Berita Terbaru</TextInter>
      </View>
      <Gap height={8} />
      {item?.slice(0, 5).map((item, i) => (
        <Card key={i} item={item} />
      ))}
      <More />
    </View>
  );
};

export default LatestNews;

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
