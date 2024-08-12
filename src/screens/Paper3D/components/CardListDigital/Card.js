import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Gap, TextInter, TimeStamp} from '../../../../components';
import {IMGDummyDigital, IMGDummyNews, theme} from '../../../../assets';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const Card = ({index, dataLength, item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ReadPaper', {item})}
      style={[
        styles.container,
        index === 0 && styles.firstCard,
        index === dataLength - 1 && styles.lastCard,
      ]}>
      <Image style={styles.image} source={{uri: item?.thumbnail}} />
      <Gap height={8} />
      <TextInter style={styles.title}>{item?.name}</TextInter>
      <Gap height={8} />
      <TimeStamp data={moment(item?.publish_date)} />
    </TouchableOpacity>
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
