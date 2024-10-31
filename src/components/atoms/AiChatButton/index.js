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
    right: 10,
    transform: [{translateY: -30}],
    width: 53,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Pastikan ada background putih agar shadow terlihat jelas
    ...Platform.select({
      ios: {
        shadowColor: '#1463AB', // Warna shadow (sama dengan warna stroke)
        shadowOffset: {width: 0, height: 0}, // Shadow agar menyebar rata
        shadowOpacity: 1, // Opacity penuh agar terlihat jelas
        shadowRadius: 6, // Ukuran shadow untuk memberi efek stroke
      },
      android: {
        elevation: 10, // Menambah ketinggian shadow di Android
        shadowColor: '#1463AB', // Menyamakan warna shadow di Android
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
