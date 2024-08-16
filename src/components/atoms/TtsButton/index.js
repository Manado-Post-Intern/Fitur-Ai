import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';

const TTSButton = ({isActive, onPress}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        {isActive ? (
          <IcTtsPause width={24} height={24} />
        ) : (
          <IcTtsPlay width={24} height={24} />
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default TTSButton;
