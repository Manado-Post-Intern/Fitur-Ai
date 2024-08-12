import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Gap, TextInter} from '../../../../components';
import {theme} from '../../../../assets';
import {useNavigation} from '@react-navigation/native';

const Card = ({size, color, type, adsConfig}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, {backgroundColor: color}]}>
        <TextInter style={styles.size}>
          Tipe <TextInter style={styles.bold}>{type}</TextInter> ( {size}
          px )
        </TextInter>
      </View>
      <Gap height={4} />
      <View style={styles.bottomContainer}>
        <Pressable
          style={styles.bottomLeftContainer}
          onPress={() => navigation.navigate('AdsPreview', {type})}>
          <TextInter style={styles.leftText}>Pratinjau</TextInter>
        </Pressable>
        <Gap width={4} />
        <Pressable
          style={styles.bottomRightContainer}
          onPress={() => navigation.navigate('AdsOrder', {type, adsConfig})}>
          <TextInter style={styles.rightText}>Pesan Sekarang</TextInter>
        </Pressable>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: theme.colors.white,
    marginBottom: 12,

    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.3)',
  },
  topContainer: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
    backgroundColor: '#3C91C0',
    paddingVertical: 8,
    alignItems: 'center',
  },
  size: {
    fontSize: 13,
    color: theme.colors.white,
  },
  bold: {
    fontSize: 13,
    fontFamily: theme.fonts.inter.bold,
    color: theme.colors.white,
  },

  bottomContainer: {
    flexDirection: 'row',
  },
  bottomLeftContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.MPBlue1,
    backgroundColor: theme.colors.darkBright,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    paddingVertical: 4,
  },
  bottomRightContainer: {
    flex: 1,
    backgroundColor: theme.colors.MPBlue1,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    paddingVertical: 4,
  },
  leftText: {
    color: theme.colors.MPBlue1,
    fontFamily: theme.fonts.inter.medium,
  },
  rightText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.inter.medium,
  },
});
