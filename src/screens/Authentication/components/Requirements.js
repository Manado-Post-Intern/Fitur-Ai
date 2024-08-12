import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IcCheckmark, IcXmark, theme} from '../../../assets';
import {Gap, TextInter} from '../../../components';

const Requirements = ({text, isWrong}) => {
  if (isWrong) {
    return (
      <View style={styles.container}>
        <IcXmark />
        <Gap width={4} />
        <TextInter style={styles.textWrong}>{text}</TextInter>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <IcCheckmark />
      <Gap width={4} />
      <TextInter style={styles.text}>{text}</TextInter>
    </View>
  );
};

export default Requirements;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    color: theme.colors.MPBlue1,
    fontSize: 10,
  },
  textWrong: {
    color: theme.colors.errorRed,
    fontSize: 10,
  },
});
