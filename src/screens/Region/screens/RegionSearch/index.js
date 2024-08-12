import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Gap, NotFound, TextInter, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import {AreaSection} from '../../components';
import {screenHeightPercentage} from '../../../../utils';

const RegionSearch = () => {
  const navigation = useNavigation();

  const notFound = false;

  if (notFound) {
    return (
      <>
        <View style={styles.topBarContainer}>
          <TopBar />
        </View>
        <View style={styles.container}>
          <NotFound />
        </View>
      </>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TopBar searchOnly={true} />

      <>
        <Gap height={14} />
        <View style={styles.informationContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <IcBack />
          </Pressable>

          <Gap height={8} />

          <TextInter style={styles.information}>
            Hasil pencarian berita untuk ‘M’
          </TextInter>
        </View>
        <Gap height={18} />
        <AreaSection />
      </>
    </ScrollView>
  );
};

export default RegionSearch;

const styles = StyleSheet.create({
  topBarContainer: {
    zIndex: 100,
  },

  container: {
    flex: 1,
    backgroundColor: theme.colors.MPWhite2,
  },
  informationContainer: {
    paddingHorizontal: 12,
    marginHorizontal: 17,
  },
  information: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: '#969696',
  },

  notFoundContainer: {
    alignItems: 'center',
    paddingHorizontal: 44,
    marginTop: 60,
  },
  notFoundIll: {
    width: 270,
    height: 212,
  },
  sorry: {
    fontFamily: theme.fonts.inter.bold,
    fontSize: 24,
    color: '#7D7979',
  },
  notFound: {
    fontSize: 24,
    color: '#7D7979',
    textAlign: 'center',
  },

  actionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: screenHeightPercentage('5%'),
  },
});
