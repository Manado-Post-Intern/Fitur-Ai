import {Image, Linking, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  IMGForYou,
  IMGLottery,
  IMGRowAds,
  IMGVideo,
  theme,
} from '../../../../assets';
import {TextInter} from '../../../../components';
import {useNavigation} from '@react-navigation/native';

const ActionSection = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.actionContainer}>
      <Pressable
        style={styles.action}
        onPress={() => navigation.navigate('Marketplace')}>
        <View style={styles.square}>
          <Image style={styles.rowAdsImage} source={IMGRowAds} />
        </View>
        <TextInter style={styles.actionLabel}>Iklan Baris</TextInter>
      </Pressable>
      <Pressable
        style={styles.action}
        onPress={() => navigation.navigate('Subscription')}>
        <View style={styles.square}>
          <Image style={styles.lotteryImage} source={IMGLottery} />
        </View>
        <TextInter style={styles.actionLabel}>Undian Berhadiah</TextInter>
      </Pressable>
      <Pressable
        style={styles.action}
        onPress={() =>
          Linking.openURL('https://www.youtube.com/@ManadoPostID')
        }>
        <View style={styles.square}>
          <Image style={styles.videoImage} source={IMGVideo} />
        </View>
        <TextInter style={styles.actionLabel}>Video</TextInter>
      </Pressable>
      <Pressable
        style={styles.action}
        onPress={() => navigation.navigate('WriteNews')}>
        <View style={styles.square}>
          <Image style={styles.forYouImage} source={IMGForYou} />
        </View>
        <TextInter style={styles.actionLabel}>Tulis Berita</TextInter>
      </Pressable>
    </View>
  );
};

export default ActionSection;

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: theme.colors.white,
    width: '100%',
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
  action: {
    alignItems: 'center',
    height: 75,
    width: 60,
    justifyContent: 'space-between',
  },
  square: {
    width: 50,
    height: 50,
    borderRadius: 11,
    backgroundColor: theme.colors.skyBlue,
  },
  rowAdsImage: {
    width: 54,
    height: 56,
    position: 'absolute',
    bottom: 0,
  },
  lotteryImage: {
    width: 52,
    height: 56,
    position: 'absolute',
    bottom: 0,
  },
  videoImage: {
    width: 61,
    height: 55,
    position: 'absolute',
    bottom: -2,
    left: -5,
  },
  forYouImage: {
    width: 46,
    height: 52,
    position: 'absolute',
    bottom: 0,
    left: 2,
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.grey1,
    textAlign: 'center',
  },
});
