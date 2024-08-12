import {Image, Linking, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  IcPinpoint,
  IcWhatsappExtraSmall,
  IMGDummyProfile,
  IMGDummyProperty,
  theme,
} from '../../../../assets';
import {Gap, TextInter} from '../../../../components';

const VerticalCard = ({item}) => {
  const handleOpenWhatsapp = phoneNumber => {
    if (phoneNumber.slice(0, 1) === '0') {
      phoneNumber = phoneNumber.slice(1);
      phoneNumber = '62' + phoneNumber;
    }
    const url = `https://wa.me/${phoneNumber}`;

    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image
          style={styles.profilePicture}
          source={{uri: item?.profile?.photo}}
        />
        <Gap width={8} />
        <TextInter style={styles.userName}>{item?.profile?.name}</TextInter>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.productImageContainer}>
          <Image style={styles.productImage} source={{uri: item?.adsImage}} />
          <TextInter style={styles.productCategory}>{item?.brand}</TextInter>
        </View>
        <Gap width={8} />
        <View style={styles.detailContainer}>
          <TextInter style={styles.productName}>{item?.adsName}</TextInter>
          <TextInter style={styles.productDetail}>
            {item?.description}
          </TextInter>
          <Gap height={4} />
          <View style={styles.tagSection}>
            <TextInter style={styles.tag}>{item?.status}</TextInter>
            <TextInter style={styles.price}>
              {parseInt(item?.price)?.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </TextInter>
          </View>
          <Gap height={4} />
          <View style={styles.locationContainer}>
            <IcPinpoint />
            <Gap width={4} />
            <TextInter style={styles.location}>{item?.address}</TextInter>
          </View>
          <Gap height={4} />
          <Pressable
            style={styles.contactButton}
            onPress={() => handleOpenWhatsapp(item?.whatsappContact)}>
            <IcWhatsappExtraSmall />
            <Gap width={4} />
            <TextInter style={styles.contact}>
              {item?.whatsappContact}
            </TextInter>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default VerticalCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginBottom: 4,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  profilePicture: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  userName: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 12,
    color: theme.colors.MPGrey3,
  },

  innerContainer: {
    flexDirection: 'row',
  },

  productImageContainer: {
    height: 164,
    width: 164,
  },
  productImage: {
    borderRadius: 4,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  productCategory: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 4,
    backgroundColor: theme.colors.dark1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopLeftRadius: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: theme.colors.white,
    borderLeftColor: theme.colors.white,
    color: theme.colors.MPWhite,
    fontSize: 8,
    fontFamily: theme.fonts.inter.medium,
  },

  detailContainer: {
    flex: 1,
  },

  productName: {
    fontSize: 12,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.dark1,
  },
  productDetail: {
    fontSize: 11,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.dark1,
  },

  tagSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    backgroundColor: theme.colors.MPBlue5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite2,
    color: theme.colors.MPWhite,
    fontSize: 11,
    fontFamily: theme.fonts.inter.medium,
    paddingVertical: 3,
    textAlign: 'center',
  },
  price: {
    paddingHorizontal: 8,
    backgroundColor: '#4CBB50',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite2,
    color: theme.colors.MPWhite,
    fontSize: 11,
    fontFamily: theme.fonts.inter.medium,
    paddingVertical: 3,
    textAlign: 'center',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flex: 1,
    flexWrap: 'wrap',
  },

  contactButton: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.MPBlue1,
    borderRadius: 5.75,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contact: {
    fontSize: 11,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
  },
});
