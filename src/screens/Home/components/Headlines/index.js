import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import Card from './Card';
import More from '../../../../components/atoms/More';

// const data = [0, 1, 2];

const Headlines = ({data}) => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>Headlines</TextInter>
      </View>
      <Gap height={4} />
      <FlatList
        overScrollMode="never"
        style={styles.headlineFlatList}
        contentContainerStyle={styles.headlineContentContainerStyle}
        horizontal
        data={data}
        renderItem={({item, index}) => <Card item={item} key={index} />}
      />
      <Gap height={12} />

      {/* <More /> */}
    </View>
  );
};

export default Headlines;

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
  headlineContentContainerStyle: {
    paddingHorizontal: 12,
  },
});
