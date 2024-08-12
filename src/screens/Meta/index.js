import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Gap, NotFound, TextInter, TopBar} from '../../components';
import {IcBack, IMGCallUsBanner, theme} from '../../assets';
import {BannerSection, Card, Categories, TrendingSection} from './components';
import {screenHeightPercentage} from '../../utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import MediumBanner from '../MoreNews/components/MediumBanner';
import {AdsContext} from '../../context/AdsContext';
import BottomBanner from '../Home/components/BottomBanner';

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const Meta = () => {
  const [detail, setDetail] = useState(false);
  const [metaData, setMetaData] = useState(null);
  const [category, setCategory] = useState(null);
  const {medium, bottom} = useContext(AdsContext);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://api.mpdigital.id/kawanua360');
      const uniqueSet = new Set();
      res.data.forEach(item => {
        if (!uniqueSet.has(item.category)) {
          uniqueSet.add(item.category);
        }
      });
      const category = Array.from(uniqueSet);
      setCategory(category);
      setMetaData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.topBarContainer}>
        <TopBar type="meta" />
      </View>
      <ScrollView style={styles.container}>
        <>
          <View style={styles.bodyContainer}>
            <View style={styles.headerContainer}>
              <IcBack />
              <TextInter style={styles.headerText}>Meta</TextInter>
            </View>
            <Gap height={6} />
            <Categories categories={category} item={metaData} />
            <Gap height={32} />
            <BannerSection item={metaData} />
            {/* <MediumBanner item={medium} /> */}
            <TrendingSection item={metaData} />
            <Gap height={10} />

            {/* <Image style={styles.callUsBanner} source={IMGCallUsBanner} /> */}
            <BottomBanner item={bottom} />
          </View>

          <View style={styles.bodyContainer}>
            <View style={styles.headerContainer}>
              <IcBack />
              <TextInter style={styles.headerText}>Hotel & Resort</TextInter>
            </View>
            <View style={styles.cardListContainer}>
              <FlatList
                data={metaData?.filter(item => item.category === 'Hotel')}
                numColumns={3}
                renderItem={({item, index}) => (
                  <Card setDetail={setDetail} key={index} item={item} />
                )}
              />
            </View>
          </View>
        </>
        {/* <NotFound /> */}

        <Gap height={screenHeightPercentage('20%')} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Meta;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
  },
  topBarContainer: {
    zIndex: 100,
  },
  bodyContainer: {
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },
  callUsContainer: {
    width: '100%',
    height: 100,
  },
  callUsBanner: {
    width: 401,
    height: 120,
    resizeMode: 'cover',
  },
});
