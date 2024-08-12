import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {IMGLottery, IMGLotteryWinner, IcBack, theme} from '../../../../assets';
import {TextInter} from '../../../../components';

const fullName = 'Francisco Bates';
const email = 'vo@piccejlol.is';

const Lottery = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.winnerContainer}>
        <Image source={IMGLottery} style={styles.boxImage} />
        <View style={{marginLeft: 5, flex: 1}}>
          <TextInter
            style={
              styles.textWinner
            }>{`Selamat Bagi Pemenang Bulan Ini`}</TextInter>
          {item.map((item, index) => {
            return (
              <TextInter style={styles.textEmail} key={index}>
                {`${item.name}\n${item.email}`}
              </TextInter>
            );
          })}
        </View>
      </View>

      <View style={{alignItems: 'center', marginTop: 8}}>
        <Image source={IMGLotteryWinner} />
        <TextInter style={styles.textDescription}>
          Silahkan mengambil hadiah anda di kantor Graha Pena Manado Post dengan
          membawa smartphone anda dan tanda pengenal.
        </TextInter>
      </View>
    </View>
  );
};

export default Lottery;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    // flex: 1,
    // backgroundColor: 'green',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textScreenTitle: {
    fontFamily: theme.fonts.inter.bold,
    fontSize: 24,
    color: theme.colors.MPGrey2,
    marginLeft: 16,
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.MPWhite,
  },
  boxImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  textWinner: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.MPBlue0,
  },
  textEmail: {
    fontFamily: theme.fonts.inter.regular,
    fontSize: 12,
    color: theme.colors.grey1,
  },
  textDescription: {
    fontFamily: theme.fonts.inter.regular,
    fontSize: 11,
    color: theme.colors.grey1,
    width: '80%',
    marginTop: 8,
  },
});
