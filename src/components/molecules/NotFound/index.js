import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGIllNotFound, theme} from '../../../assets';
import {Button, Gap, TextInter} from '../../atoms';
import {useNavigation} from '@react-navigation/native';
import {screenHeightPercentage} from '../../../utils';

const NotFound = ({text}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.notFoundContainer}>
        <Image style={styles.notFoundIll} source={IMGIllNotFound} />
        <TextInter style={styles.sorry}>Maaf</TextInter>
        <TextInter style={styles.notFound}>
          {text ? text : 'Tidak ada berita terkait pencarian anda'}
        </TextInter>
      </View>
      <View style={styles.actionContainer}>
        <Button
          // eslint-disable-next-line react-native/no-inline-styles
          style={{backgroundColor: '#0547831A'}}
          type="secondary"
          label="Kembali ke Halaman Sebelumnya"
          onPress={() => navigation.goBack()}
        />
        <Gap height={8} />
        <Button
          label="Kembali ke Beranda"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    paddingBottom: screenHeightPercentage('5%'),
  },
});
