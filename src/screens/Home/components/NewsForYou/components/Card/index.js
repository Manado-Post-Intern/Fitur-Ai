import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMGDummyNews, theme} from '../../../../../../assets';
import {
  Actions,
  CategoryHorizontal,
  Gap,
  TextInter,
  TimeStamp,
} from '../../../../../../components';
import {useNavigation} from '@react-navigation/native';

const Card = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => navigation.push('Article', {articleId: item?.id})}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item?.photo_url}} />
      </View>
      <Gap width={14} />
      <View style={styles.informationContainer}>
        <TextInter style={styles.title}>{item?.title}</TextInter>
        <Gap height={8} />
        <TimeStamp data={item?.published_date} />
        <Gap height={4} />
        <CategoryHorizontal />
        <Gap height={4} />
        <Actions item={item} />
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 21,
    backgroundColor: theme.colors.white,
    marginVertical: 4,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  informationContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.dark1,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categories: {
    marginHorizontal: 8,
    marginVertical: 5,
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 10,
    color: theme.colors.grey1,
  },
});
