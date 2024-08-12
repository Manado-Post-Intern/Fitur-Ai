import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Gap, TextInter} from '../../../../components';
import {
  IcArrowRightWhite,
  IMGBeach1,
  IMGBeach2,
  IMGVirtualTourBg,
  IMGVirtualTourIll,
  theme,
} from '../../../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {screenWidth} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';

const BannerSection = ({item}) => {
  const navigation = useNavigation();
  const filter = item?.filter(item => item.category === 'Tour');
  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <LinearGradient
        style={styles.virtualTourContainer}
        useAngle={true}
        angle={135}
        angleCenter={{x: 0.7, y: 0.7}}
        colors={['#054783', '#012445']}>
        <TextInter style={styles.virtualTour}>Virtual Tour</TextInter>
        <Image style={styles.virtualTourBg} source={IMGVirtualTourBg} />
        <Image style={styles.virtualTourIll} source={IMGVirtualTourIll} />
      </LinearGradient>

      <Gap height={10} />

      {filter?.map((item, index) => {
        return (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MetaDetail', {item})}
              style={styles.bannerShadow}>
              <ImageBackground
                style={styles.bannerContainer}
                imageStyle={styles.bannerImage}
                source={{uri: item?.thumbnail}}></ImageBackground>
            </TouchableOpacity>

            <Gap height={7} />
          </View>
        );
      })}

      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MetaDetail', {item: filter[1]})}
        style={styles.bannerShadow}>
        <ImageBackground
          style={styles.bannerContainer}
          imageStyle={styles.bannerImage}
          source={IMGBeach2}>
          <TextInter style={styles.bannerText}>
            {filter[1]?.site_name}
          </TextInter>
          <Gap width={11} />
          <IcArrowRightWhite />
        </ImageBackground>
      </TouchableOpacity> */}
    </View>
  );
};

export default BannerSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    height: 234,
    marginBottom: 11,
  },
  background: {
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    width: screenWidth(),
    height: 234,
    position: 'absolute',
    top: 11,
  },

  virtualTourContainer: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
  },
  virtualTour: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.fontLight,
    fontWeight: '700',
    marginLeft: 24,
  },
  virtualTourBg: {
    height: '100%',
    position: 'absolute',
    right: 0,
    width: 202,
  },
  virtualTourIll: {
    width: 110,
    resizeMode: 'contain',
    position: 'absolute',
    right: 8,
  },

  bannerShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
    backgroundColor: theme.colors.transparent,
    borderRadius: 8,
  },
  bannerContainer: {
    height: 76,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 17,
  },
  bannerImage: {
    borderRadius: 8,
  },
  bannerText: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: theme.colors.fontLight,
  },
});
