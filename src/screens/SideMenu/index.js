import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import {screenHeightPercentage} from '../../utils';
import {
  theme,
  IcEdit,
  IcWriteNews,
  IcSubscription,
  IcMarketplace,
  IcAds,
  IcAboutUs,
  IcLogout,
} from '../../assets';
import {Gap, TextInter} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {SocialSignIn} from '../Authentication/components';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../context/AuthContext';

const SideMenu = () => {
  const navigation = useNavigation();
  const {mpUser} = useContext(AuthContext);

  const handleLogout = () => auth().signOut();
  return (
    <View style={styles.container}>
      {mpUser ? (
        <View style={styles.headerContainer}>
          <Image style={styles.profileImage} source={{uri: mpUser?.photo}} />
          <Gap width={16} />
          <View style={styles.headerTextContainer}>
            <View style={styles.userNameContainer}>
              <TextInter style={styles.name}>{mpUser?.fullName}</TextInter>
              <TextInter
                style={styles.email}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                {mpUser?.email}
              </TextInter>
            </View>
            <Gap width={16} />
            <Pressable
              style={styles.editButton}
              onPress={() => navigation.navigate('Profile')}>
              <IcEdit />
            </Pressable>
          </View>
        </View>
      ) : (
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.errorRed,
            paddingHorizontal: 5,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <TextInter>Login terlebih dahulu dengan Google</TextInter>
        </View>
      )}

      <Gap height={16} />

      <View style={styles.sectionContainer}>
        <Pressable
          onPress={() => navigation.navigate('WriteNews')}
          style={[styles.section, styles.bottomBorder]}>
          <IcWriteNews />
          <Gap width={10} />
          <TextInter style={styles.sectionLabel}>Tulis Berita</TextInter>
        </Pressable>
        <Pressable
          style={styles.section}
          onPress={() => navigation.navigate('Subscription')}>
          <IcSubscription />
          <Gap width={10} />
          <TextInter style={styles.sectionLabel}>Berlangganan</TextInter>
        </Pressable>
        <Pressable
          style={styles.section}
          onPress={() => navigation.navigate('Marketplace')}>
          <IcMarketplace />
          <Gap width={10} />
          <TextInter style={styles.sectionLabel}>Marketplace</TextInter>
        </Pressable>
        <Pressable
          style={[styles.section, styles.bottomBorder]}
          onPress={() => {
            mpUser
              ? navigation.navigate('Ads')
              : alert('Login terlebih dahulu');
          }}>
          <IcAds />
          <Gap width={10} />
          <TextInter style={styles.sectionLabel}>Pasang Iklan</TextInter>
        </Pressable>
        <Pressable
          style={styles.section}
          onPress={() => navigation.navigate('AboutUs')}>
          <IcAboutUs />
          <Gap width={10} />
          <TextInter style={styles.sectionLabel}>Tentang Kami</TextInter>
        </Pressable>
        {mpUser ? (
          <Pressable onPress={handleLogout} style={styles.section}>
            <IcLogout />
            <Gap width={10} />
            <TextInter style={styles.sectionLabel}>Logout</TextInter>
          </Pressable>
        ) : (
          <SocialSignIn type={'google'} />
        )}
      </View>

      <View style={styles.footerContainer}>
        <TextInter style={styles.footerText}>
          Copyright by Manado Post 2022
        </TextInter>
        <TextInter style={styles.footerText}>V. 2.1.0</TextInter>
      </View>
    </View>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 38,
    paddingTop: screenHeightPercentage('5%'),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkBright,
    paddingBottom: 16,
    width: '100%',
  },
  profileImage: {
    borderRadius: 100,
    width: '20%',
    aspectRatio: 1,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameContainer: {
    flex: 1,
  },
  name: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.MPBlue0,
  },
  email: {
    fontSize: 12,
    color: theme.colors.grey1,
  },
  editButton: {
    borderRadius: 8,
    backgroundColor: theme.colors.MPGrey2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    aspectRatio: 1,
    // height: 32,
  },

  sectionContainer: {
    width: '60%',
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.grey1,
  },
  bottomBorder: {
    borderBottomColor: theme.colors.darkBright,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },

  footerContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
    borderTopColor: theme.colors.darkBright,
    borderTopWidth: 1,
    marginBottom: screenHeightPercentage('5%'),
  },
  footerText: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 14,
    color: theme.colors.grey1,
  },
});
