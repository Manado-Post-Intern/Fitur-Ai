import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {} from '../../atoms';
import {IMGBanner2} from '../../../assets';
import {useNavigation} from '@react-navigation/native';

const Banner2 = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Subscription')}
      style={styles.bannerContainer}>
      <Image style={styles.banner} source={IMGBanner2} />
    </TouchableOpacity>
  );
};

export default Banner2;

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
