import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, Pagination, TextInter, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import {screenHeightPercentage} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import Card from '../MPDigitalAll/Card';
import SearchNotFound from '../SearchNotFound';

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SearchPaper = () => {
  const navigation = useNavigation();
  const search = 'date';

  const type = 'koran'; // koran or digital
  const notFound = 'paper'; // paper or artikel

  if (notFound.length > 0) {
    return <SearchNotFound type={notFound} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <IcBack />
          </Pressable>
        </View>

        <Gap height={12} />
        {search === 'text' ? (
          <TextInter style={styles.searched}>
            Hasil pencarian untuk '
            <TextInter style={[styles.searched, styles.bold]}>covid</TextInter>'
          </TextInter>
        ) : (
          <TextInter style={styles.searched}>
            Hasil pencarian untuk edisi{' '}
            <TextInter style={[styles.searched, styles.bold]}>
              1 Januari 2022
            </TextInter>
          </TextInter>
        )}
        <Gap height={12} />

        <View style={styles.flatListContainer}>
          <FlatList
            data={data}
            numColumns={3}
            renderItem={({item, index}) =>
              type === 'digital' ? (
                <Card key={index} index={index} dataLength={data.length} />
              ) : (
                <Card key={index} index={index} dataLength={data.length} />
              )
            }
          />
        </View>
      </View>
      <Pagination />

      <Gap height={screenHeightPercentage('15%')} />
    </ScrollView>
  );
};

export default SearchPaper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
  },
  topBarContainer: {
    zIndex: 100,
  },

  bodyContainer: {
    flex: 1,
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

  searched: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 14,
    color: '#969696',
    marginLeft: 24,
  },
  bold: {
    fontFamily: theme.fonts.inter.bold,
  },

  flatListContainer: {
    paddingHorizontal: 17,
  },
});
