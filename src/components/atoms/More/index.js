import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Gap from '../Gap';
import TextInter from '../TextInter';
import {IcArrowRight, theme} from '../../../assets';
import {useNavigation} from '@react-navigation/native';

const More = ({sectionId, trending, forYou, item}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (sectionId) {
      navigation.navigate('MoreNews', {sectionId});
    } else if (trending) {
      navigation.navigate('Trending');
    } else if (forYou) {
      navigation.navigate('MoreNews', {forYou: true, newsForYou: item});
    } else {
      navigation.navigate('MoreNews', {latest: true});
    }
  };
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <TextInter style={styles.label}>Lihat Lebih Banyak</TextInter>
      <Gap width={4} />
      <IcArrowRight />
    </Pressable>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.MPWhite4,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  label: {
    color: theme.colors.MPBlue5,
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
  },
});
