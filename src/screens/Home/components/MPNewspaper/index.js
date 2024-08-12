import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Banner2, Gap, More, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import {CardList} from './components';

const MPNewspaper = () => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>MP Koran</TextInter>
      </View>
      <Gap height={8} />
      <Banner2 />
      <Gap height={16} />
      <CardList />
      <Gap height={4} />
      <View style={styles.moreContainer}>
        <More />
      </View>
    </View>
  );
};

export default MPNewspaper;

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
  moreContainer: {
    paddingHorizontal: 16,
  },
});
