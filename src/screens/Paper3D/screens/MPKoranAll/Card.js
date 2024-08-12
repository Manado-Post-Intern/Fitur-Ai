import {Image, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {IMGDummyNewspaper, theme} from '../../../../assets';
import {Gap, TextInter} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const Card = ({index, dataLength, item}) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('ReadPaper', {item});
  };
  return (
    <Pressable
      style={[
        styles.container,
        index === 0 && styles.firstCard,
        index === dataLength - 1 && styles.lastCard,
        (index + 1) % 3 === 0 && styles.lastCard,
        index % 3 === 0 && styles.firstCard,
      ]}
      onPress={() => onPress()}>
      {item?.thumbnail && (
        <Image style={styles.image} source={{uri: item?.thumbnail}} />
      )}
      <Gap height={8} />
      <TextInter style={styles.title}>
        {moment(item?.publish_date).format('DD MMMM YYYY')}
      </TextInter>
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    width: 165,
    padding: 8,
    backgroundColor: theme.colors.white,
    marginBottom: 4,
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
    height: 173,
    borderRadius: 4,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 10,
    color: theme.colors.dark1,
  },
});
