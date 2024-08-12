import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {GlowCircle, TextInter} from '../../../../components';
import {IMGMPText, theme} from '../../../../assets';

const Page = ({item}) => {
  const width = Dimensions.get('window').width;
  return (
    <View style={[styles.container, {width}]}>
      <View style={styles.topGlowContainer}>
        <GlowCircle />
      </View>
      <Image source={IMGMPText} style={styles.manadoPostTextLogo} />
      <View style={styles.illustrationContainer}>
        <Image source={item.image} style={styles.illustration} />
        <View style={styles.middleGlowContainer}>
          <GlowCircle />
        </View>
      </View>
      <View style={styles.detailContainer}>
        <TextInter style={styles.title}>{item.title}</TextInter>
        <TextInter style={styles.subText}>{item.subText}</TextInter>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topGlowContainer: {
    position: 'absolute',
    top: -270,
  },
  manadoPostTextLogo: {
    width: '60%',
    resizeMode: 'contain',
    zIndex: 1,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    height: 266,
    resizeMode: 'contain',
    zIndex: 1,
  },
  middleGlowContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 0,
  },
  detailContainer: {
    width: 269,
    marginTop: '10%',
  },
  title: {
    fontFamily: theme.fonts.inter.bold,
    fontSize: 20,
    color: theme.colors.fontLight,
    opacity: 0.75,
  },
  subText: {
    fontSize: 20,
    color: theme.colors.fontLight,
    opacity: 0.75,
  },
});
