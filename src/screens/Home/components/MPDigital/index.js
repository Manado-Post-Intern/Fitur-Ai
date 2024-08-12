import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Banner1, Gap, More, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import {CardList} from './components';

const MPDigital = () => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>MP Digital</TextInter>
      </View>
      <Gap height={8} />
      <Banner1 />
      <Gap height={16} />
      <CardList />
      <Gap height={4} />
      <View style={styles.moreContainer}>
        <More />
      </View>
    </View>
  );
};

export default MPDigital;

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
