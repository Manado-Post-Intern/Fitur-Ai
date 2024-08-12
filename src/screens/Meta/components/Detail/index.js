import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  IcCopyLink,
  IcGmaps,
  IMGHotelBestWestern,
  IMGRoundFacebook,
  IMGRoundInstagram,
  IMGRoundWhatsapp,
  theme,
} from '../../../../assets';
import {Gap, TextInter} from '../../../../components';

const Detail = () => {
  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={IMGHotelBestWestern} />
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>Hotel Best Western</TextInter>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.informationContainer}>
          <TextInter style={styles.description}>
            Situated in a strategic location at Bahu Mall integrated area
            complete with shopping, commercial, and entertainment facilities
            within easy access to Boulevard area (Manado's number 1 street)
            while Sam Ratulangi International Airport is only 45 minutes drive.
            Best Western The Lagoon Hotel offers perfect spots for great
            adventure ranging from scuba diving named Bunaken National Park as
            one of the best Indonesia’s dive spot, volcano trekking tours, white
            water rafting, to The Tangkoko Nature Reserve. For a more relaxing
            sunny day, visit Pall Beach or Pulisan Beach to enjoy the white sand
            and clear blue water.
          </TextInter>

          <Gap height={16} />

          <View style={styles.addressContainer}>
            <IcGmaps />
            <Gap width={16} />
            <TextInter style={styles.address}>
              Jl. Wolter Monginsidi No.1, Bahu, Kec. Malalayang, Kota Manado,
              Sulawesi Utara 95115
            </TextInter>
          </View>

          <Gap height={16} />

          <TextInter style={styles.subText}>
            Info lebih lanjut tentang lokasi ini
          </TextInter>

          <Gap height={16} />

          <View style={styles.socialMediaContainer}>
            <Image style={styles.socialMedia} source={IMGRoundWhatsapp} />
            <Image style={styles.socialMedia} source={IMGRoundFacebook} />
            <Image style={styles.socialMedia} source={IMGRoundInstagram} />
          </View>

          <Gap height={16} />

          <TextInter style={styles.pageLink}>Page Link</TextInter>
          <Gap height={8} />

          <View style={styles.linkContainer}>
            <TextInter style={styles.link}>
              httpd://manadopost.jawapost.com/asdwgeasuiy
            </TextInter>
            <IcCopyLink />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 637,
    width: '100%',
  },
  titleContainer: {
    paddingLeft: 22,
    paddingRight: 10,
    height: 48,
    position: 'absolute',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    top: 7,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },

  bodyContainer: {
    marginHorizontal: 24,
  },
  informationContainer: {
    top: -32,
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF80',
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.dark1,
  },
  addressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.MPBlue2,
    padding: 8,
  },
  address: {
    fontSize: 12,
    color: theme.colors.white,
    flex: 1,
  },

  subText: {
    color: theme.colors.grey1,
  },

  socialMediaContainer: {
    flexDirection: 'row',
  },
  socialMedia: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 16,
  },

  pageLink: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue2,
  },

  linkContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 16,
  },
  link: {
    flex: 1,
    fontFamily: theme.fonts.inter.semiBold,
    color: '#8F8F8F',
  },
});
