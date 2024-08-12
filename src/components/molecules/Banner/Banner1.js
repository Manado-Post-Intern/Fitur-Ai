import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {} from '../../atoms';
import {IMGBanner1} from '../../../assets';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Banner1 = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Subscription')}
      style={styles.bannerContainer}>
      <Image style={styles.banner} source={IMGBanner1} />
    </TouchableOpacity>
  );
};

export default Banner1;

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
  },
  banner: {
    width: '100%',
    height: 130,
    resizeMode: 'contain',
  },
});
