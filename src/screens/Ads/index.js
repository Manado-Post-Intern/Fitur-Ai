import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ChevroletBackButton, Gap, TextInter} from '../../components';
import {IcEdit, IMGDummyProfile, theme} from '../../assets';
import {screenHeightPercentage} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import {Card} from './components';
import database from '@react-native-firebase/database';
import {AuthContext} from '../../context/AuthContext';

const Ads = () => {
  const navigation = useNavigation();
  const [adsConfig, setAdsConfig] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    database()
      .ref('/ads/options')
      .once('value')
      .then(snapshot => {
        setAdsConfig(snapshot.val());
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ChevroletBackButton />
        <TextInter style={styles.title}>MP Ads</TextInter>
        <View style={styles.hide}>
          <ChevroletBackButton />
        </View>
      </View>

      <Gap height={24} />

      <View style={styles.body}>
        <View style={styles.profileHeaderContainer}>
          <Image style={styles.profileImage} source={{uri: user.photoURL}} />
          <Gap width={16} />
          <View style={styles.headerTextContainer}>
            <View>
              <TextInter style={styles.name}>{user.displayName}</TextInter>
              <TextInter style={styles.email}>{user.email}</TextInter>
            </View>
            <Gap width={16} />
            {/* <Pressable
              style={styles.editButton}
              onPress={() => navigation.navigate('Profile')}>
              <IcEdit />
            </Pressable> */}
          </View>
        </View>
        <Gap height={8} />
        <TextInter style={styles.text1}>
          Beriklan melalui
          <TextInter style={styles.specialText1}>
            {' '}
            Manado Post Digital
          </TextInter>
        </TextInter>
        <Gap height={16} />
        <Card
          color="#3C91C0"
          size="300 x 100"
          type="Top Banner"
          adsConfig={adsConfig[0]}
        />
        <Card
          color="#25A1A9"
          size="300 x 100"
          type="Bottom Banner"
          adsConfig={adsConfig[1]}
        />
        <Card
          color="#0DA580"
          size="300 x 160"
          type="Second Banner"
          adsConfig={adsConfig[2]}
        />
        <Card
          color="#254CB1"
          size="300 x 300"
          type="Medium Banner"
          adsConfig={adsConfig[3]}
        />
        <Card
          color="#B6862A"
          size="300 x 600"
          type="Full Page Ads"
          adsConfig={adsConfig[4]}
        />
      </View>
    </View>
  );
};

export default Ads;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingTop: screenHeightPercentage('5%'),
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.MPGrey2,
  },
  hide: {
    opacity: 0,
  },

  body: {
    paddingHorizontal: 28,
  },

  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkBright,
    paddingBottom: 16,
  },
  profileImage: {
    borderRadius: 100,
    width: 75,
    height: 75,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 32,
    height: 32,
  },

  text1: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  specialText1: {
    fontSize: 14,
    color: theme.colors.MPBlue1,
    fontFamily: theme.fonts.inter.semiBold,
  },
});
