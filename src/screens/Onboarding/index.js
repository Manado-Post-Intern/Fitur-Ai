import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  IMGOnboarding1,
  IMGOnboarding2,
  IMGOnboarding3,
  IMGOnboarding4,
  theme,
} from '../../assets';
import {Gap, TextInter} from '../../components';
import Page from './components/Page';
import {useNavigation} from '@react-navigation/native';
import SocialSignIn from '../Authentication/components/SocialSignIn';
import {Text} from 'react-native';

const data = [
  {
    id: 0,
    title: 'TRENDING',
    subText: 'Menampilkan berita yang sedang trending saat ini semakin mudah.',
    image: IMGOnboarding1,
  },
  {
    id: 1,
    title: '3D PAPER',
    subText:
      'Nikmati pengalaman baca majalah dan koran dari smartphone anda dan dapatkan undian berhadiah.',
    image: IMGOnboarding2,
  },
  {
    id: 2,
    title: 'META',
    subText:
      'Saat ini anda dapat mengunjungi lokasi virtual di sulawesi utara dari rumah anda.',
    image: IMGOnboarding3,
  },
  {
    id: 3,
    title: 'IKLAN BARIS',
    subText:
      'Lagi cari Kendaraan, Rumah, Lowongan Pekerjaan atau apapun keperluaanmu',
    image: IMGOnboarding4,
  },
];

const Onboarding = () => {
  const navigation = useNavigation();
  /**
   * Logic for flatlist
   */
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const handleSkip = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.flatListContainer}>
          <FlatList
            data={data}
            horizontal
            renderItem={({item}) => <Page item={item} />}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            bounces={false}
            pagingEnabled
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {
                useNativeDriver: false,
              },
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>

        <View style={styles.paginationContainer}>
          <View style={styles.dotContainer}>
            {data.map((dot, i) => (
              <View
                style={[styles.dot, i === currentIndex && styles.activeDot]}
                key={i}
              />
            ))}
          </View>
          {/* <Pressable style={styles.skipButton} onPress={handleSkip}>
            <TextInter style={styles.skipLabel}>SKIP</TextInter>
          </Pressable> */}

          <Text style={{marginTop: 30, marginBottom: 5}}>
            Masuk untuk mulai membaca
          </Text>
          <SocialSignIn type={'google'} />
          <Gap height={75} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.primary,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flex: 3,
  },

  paginationContainer: {
    width: 269,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    marginRight: 32,
  },
  activeDot: {
    backgroundColor: theme.colors.skyBlue2,
  },
  skipButton: {
    backgroundColor: theme.colors.skyBlue2,
    width: 92,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 20,
  },
  skipLabel: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 16,
    color: theme.colors.primary,
  },
});
