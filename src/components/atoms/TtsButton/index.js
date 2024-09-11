import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext'; // Import context
import {useErrorNotification} from '../../../context/ErrorNotificationContext';

// Dapatkan fungsi setCleanContent dari context
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const TTSButton = ({isActive, onPress, content}) => {
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const {setCleanArticle} = useSnackbar(); // Dapatkan fungsi setCleanContent dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi

  useEffect(() => {
    // Listener untuk memantau perubahan koneksi
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected); // Simpan status koneksi
    });

    // Unsubscribe saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  const handlePress = async () => {
    // Cek apakah ada koneksi internet
    if (!isConnected) {
      showError('Oops, cannot play article sound. Please try again.'); // Panggil showError
      return;
    }

    // Set bahasa default untuk TTS
    Tts.setDefaultLanguage('id-ID');

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '');

      // Trigger Tts.speak atau Tts.stop berdasarkan isActive
      if (isActive) {
        Tts.stop();
      } else {
        try {
          Tts.speak(cleanContent);
        } catch (error) {
          Alert.alert('Error', 'Terjadi kesalahan saat menggunakan TTS.');
          console.error('TTS error:', error);
        }
      }
    } else {
      console.log('Content is undefined or null');
    }

    if (onPress) {
      onPress();
    }
  };
  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
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
