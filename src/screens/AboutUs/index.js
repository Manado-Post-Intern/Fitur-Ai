import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {screenHeightPercentage} from '../../utils';
import {
  IMGFacebook,
  IMGInstagram,
  IMGMPTextPrimary,
  IMGWeb,
  IMGWhatsapp,
  theme,
} from '../../assets';
import {ChevroletBackButton, Gap, TextInter} from '../../components';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ChevroletBackButton />
        <Image style={styles.MPLogo} source={IMGMPTextPrimary} />
        <View style={styles.hide}>
          <ChevroletBackButton />
        </View>
      </View>

      <Gap height={24} />

      <View style={styles.addressLocationContainer}>
        <TextInter style={styles.mainLocation}>Gedung Graha Pena</TextInter>
        <TextInter style={styles.text}>
          Jl. Babe Palar No. 62 Wanea - Manado
        </TextInter>
        <TextInter style={styles.text}>Tlp : (0431) 855-558, 855-559</TextInter>
        <TextInter style={styles.text}>Hp/WA : 081340747101</TextInter>
        <TextInter style={styles.text}>
          Email : redaksimanadopost@gmail.com
        </TextInter>
      </View>
      <View style={styles.footerContainer}>
        <Pressable>
          <TextInter style={styles.actionLabel}>Redaksi</TextInter>
        </Pressable>
        <Pressable>
          <TextInter style={styles.actionLabel}>Tentang Kami</TextInter>
        </Pressable>
        <Pressable>
          <TextInter style={styles.actionLabel}>Pedoman Media Siber</TextInter>
        </Pressable>
        <Pressable>
          <TextInter style={styles.actionLabel}>Privacy Policy</TextInter>
        </Pressable>
        <Gap height={12} />
        <TextInter style={styles.extra}>
          untuk menghubungi bisa klik{'\n'}button di bawah ini:
        </TextInter>
        <Gap height={24} />
        <View style={styles.socialMediaContainer}>
          <Pressable>
            <Image style={styles.socialMedia} source={IMGWeb} />
          </Pressable>
          <Pressable>
            <Image style={styles.socialMedia} source={IMGWhatsapp} />
          </Pressable>
          <Pressable>
            <Image style={styles.socialMedia} source={IMGInstagram} />
          </Pressable>
          <Pressable>
            <Image style={styles.socialMedia} source={IMGFacebook} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeightPercentage('5%'),
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 22,
  },
  MPLogo: {
    width: 208,
    resizeMode: 'contain',
  },
  hide: {
    opacity: 0,
  },

  addressLocationContainer: {
    alignItems: 'center',
    flex: 1,
  },
  mainLocation: {
    fontFamily: theme.fonts.inter.bold,
    fontSize: 14,
    color: theme.colors.grey1,
  },
  text: {
    color: theme.colors.grey1,
    fontSize: 14,
    lineHeight: 22.5,
  },

  footerContainer: {
    alignItems: 'center',
    paddingBottom: screenHeightPercentage('5%'),
  },
  actionLabel: {
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
    marginBottom: 8,
  },
  extra: {
    textAlign: 'center',
    color: theme.colors.grey1,
  },

  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 177,
  },
  socialMedia: {
    width: 32,
    height: 32,
  },
});
