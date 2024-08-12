import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {IcArrowLeft} from '../../../assets';
import {useNavigation} from '@react-navigation/native';
import {isSlimScreen} from '../../../utils';

const BackButton = () => {
  const navigation = useNavigation();
  const checkValue = () => {
    if (isSlimScreen()) {
      return 40;
    } else {
      return 50;
    }
  };
  return (
    <Pressable style={styles.container} onPress={() => navigation.goBack()}>
      <IcArrowLeft width={checkValue()} height={checkValue()} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'baseline',
  },
});
