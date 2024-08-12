import {Pressable} from 'react-native';
import React from 'react';
import {IcChevronLeft} from '../../../assets';
import {useNavigation} from '@react-navigation/native';

const ChevroletBackButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <IcChevronLeft />
    </Pressable>
  );
};

export default ChevroletBackButton;
