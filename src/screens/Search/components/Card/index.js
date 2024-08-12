import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {theme} from '../../../../assets';
import {
  CategoryHorizontal,
  Gap,
  TextInter,
  TimeStamp,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';

const Card = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => navigation.navigate('Article', {articleId: item?.id})}>
      <TextInter style={styles.title}>{item?.title}</TextInter>
      <Gap height={8} />
      <TimeStamp data={item?.published_date} />
      <Gap height={4} />
      <CategoryHorizontal />
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 21,
    paddingVertical: 8,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.dark1,
  },
});
