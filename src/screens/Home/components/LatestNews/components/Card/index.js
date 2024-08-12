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
      onPress={() => navigation.navigate('Article', {articleId: item?.id})}
      style={styles.container}>
      <Image style={styles.image} source={{uri: item?.photo_url}} />
      <View style={styles.informationContainer}>
        <TextInter style={styles.title} numberOfLines={3}>
          {item?.title}
        </TextInter>
        <Gap height={8} />
        <TimeStamp data={item?.published_date} />
        <Gap height={4} />
        <CategoryHorizontal />
        <Gap height={4} />
        <Actions type="big" item={item} />
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    marginVertical: 4,
  },
  image: {
    height: 242,
    width: '100%',
  },
  informationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.dark1,
  },
});
