import {StyleSheet, View} from 'react-native';
import React from 'react';
import {NotFound, TopBar} from '../../../../components';
import {theme} from '../../../../assets';

const SearchNotFound = ({type}) => {
  const text =
    type === 'paper'
      ? 'Edisi / Judul yang anda cari tidak tersedia'
      : 'Berita yang anda cari Tidak ada';
  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <View style={styles.bodyContainer}>
        <NotFound text={text} />
      </View>
    </View>
  );
};

export default SearchNotFound;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
    flex: 1,
  },
  topBarContainer: {
    zIndex: 100,
  },
  bodyContainer: {
    flex: 1,
  },
});
