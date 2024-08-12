import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGDummyNews, theme} from '../../../../../../assets';
import {Gap, TextInter, TimeStamp} from '../../../../../../components';

const Card = ({index, dataLength}) => {
  return (
    <View
      style={[
        styles.container,
        index === 0 && styles.firstCard,
        index === dataLength - 1 && styles.lastCard,
      ]}>
      <Image style={styles.image} source={IMGDummyNews} />
      <Gap height={8} />
      <TextInter style={styles.title}>Irjen Setyo Pulang Kampung</TextInter>
      <Gap height={8} />
      <TimeStamp />
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: 165,
    padding: 8,
    backgroundColor: theme.colors.white,
  },
  firstCard: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  lastCard: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  image: {
    width: '100%',
    height: 215,
    borderRadius: 4,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 13,
    color: theme.colors.dark1,
  },
});
