import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TextInter} from '../../atoms';
import {IcChevronLeftDisabled, IcChevronRight, theme} from '../../../assets';

const Pagination = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={[styles.item]}>
          <IcChevronLeftDisabled />
        </View>
        <View style={[styles.item, styles.active]}>
          <TextInter style={[styles.number, styles.active]}>1</TextInter>
        </View>
        <View style={[styles.item, styles.ofContainer]}>
          <TextInter style={styles.of}>of</TextInter>
        </View>
        <View style={styles.item}>
          <TextInter style={styles.number}>24</TextInter>
        </View>
        <View style={styles.item}>
          <IcChevronRight />
        </View>
      </View>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    backgroundColor: theme.colors.white,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  item: {
    width: 38,
    height: 38,
    borderWidth: 0.6,
    borderColor: '#BCBCBC',
    borderRadius: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  active: {
    color: theme.colors.white,
    backgroundColor: theme.colors.MPBlue1,
  },
  number: {
    fontSize: 11,
    fontFamily: theme.fonts.inter.extraBold,
    color: theme.colors.MPBlue1,
  },

  ofContainer: {
    borderWidth: 0,
  },
  of: {
    fontSize: 11,
    fontFamily: theme.fonts.inter.extraBold,
    color: '#BCBCBC',
  },
});
