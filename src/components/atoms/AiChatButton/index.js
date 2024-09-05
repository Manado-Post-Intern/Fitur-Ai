import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {IcAiChat, theme} from '../../../assets'; // Adjust the icon import path

const AiChatButton = ({onPress, navigation}) => {
  const handlePress = () => {
    navigation.navigate('AiChat'); // Replace 'TargetScreen' with the name of your target screen
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.iconWrapper}>
        <IcAiChat />
      </View>
    </TouchableOpacity>
  );
};

export default AiChatButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    // top: '83%',
    right: 10,
    transform: [{translateY: -30}],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      //   ios: {
      //     shadowColor: '#000', // Single shadow color for iOS
      //     shadowOffset: {width: 5, height: 5}, // Offset for iOS shadow
      //     shadowOpacity: 0.3, // Opacity for iOS shadow
      //     shadowRadius: 10, // Radius for iOS shadow
      //   },
      android: {
        elevation: 5, // Elevation for Android shadow
        shadowColor: '#1463AB',
      },
    }),
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
