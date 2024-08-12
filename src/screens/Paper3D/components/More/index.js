import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {Gap, TextInter} from '../../../../components';
import {IcArrowRight, theme} from '../../../../assets';
import {useNavigation} from '@react-navigation/native';

const More = ({to}) => {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate(to)}>
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
