import {Image, Linking, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  IcPinpoint,
  IcWhatsappExtraSmall,
  IMGDummyProfile,
  IMGDummyProperty,
  theme,
} from '../../../../assets';
import {Gap, TextInter} from '../../../../components';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const CARD_WIDTH = 172; // Card width minus 4 horizontal padding

const HorizontalCard = ({item}) => {
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
      <Gap height={6} />
      <View style={styles.imageSection}>
        <View style={styles.productImageContainer}>
          <Image style={styles.productImage} source={{uri: item?.adsImage}} />
          <TextInter style={styles.productCategory}>{item?.label}</TextInter>
        </View>
      </View>
      <Gap height={6} />
      <TextInter style={styles.productName} numberOfLines={3}>
        {item?.adsName}
      </TextInter>
      <Gap height={6} />
      <View style={styles.tagSection}>
        <TextInter style={styles.tag}>{item?.status}</TextInter>
        <TextInter style={styles.price}>
          {parseInt(item.price, 10)?.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          })}
        </TextInter>
      </View>
      <Gap height={6} />
      <View style={styles.locationContainer}>
        <IcPinpoint />
        <Gap width={4} />
        <TextInter style={styles.location} numberOfLines={4}>
          {item?.address}
        </TextInter>
      </View>
      <Gap height={6} />
      <Pressable
        style={styles.contactButton}
        onPress={() => handleOpenWhatsapp(item?.whatsappContact)}>
        <IcWhatsappExtraSmall />
        <Gap width={4} />
        <TextInter style={styles.contact}>{item?.whatsappContact}</TextInter>
      </Pressable>
    </View>
  );
};

export default HorizontalCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    width: CARD_WIDTH,
    paddingHorizontal: 4,
    marginRight: 8,
    paddingVertical: 6,
    borderRadius: 4.75,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  profilePicture: {
    width: 16,
    height: 16,
    borderRadius: 20,
  },
  userName: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 10,
    color: theme.colors.MPGrey3,
  },

  imageSection: {
    width: '100%',
  },
  productImageContainer: {
    height: 141,
  },
  productImage: {
    borderRadius: 4,
    flex: 1,
    resizeMode: 'contain',
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
  productName: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.semiBold,
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
