import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {IcTtsArticlePlay, IcTtsArticlePause} from '../../../assets';
import {Snackbar} from 'react-native-paper';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useErrorNotification} from '../../../context/ErrorNotificationContext'; // Import context
import NetInfo from '@react-native-community/netinfo';

const TtsArticleButton = ({scrollY, isActive, onPress, article, title}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {showSnackbar, hideSnackbar, setCleanArticle} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
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
      showError('Oops, cannot play article sound. Please try again.'); // Tampilkan notifikasi error
      return;
    }

    // Bersihkan HTML tags dari artikel
    let cleanArticle;
    try {
      cleanArticle = article
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '');
    } catch (error) {
      showError('Terjadi kesalahan saat membersihkan artikel.'); // Tampilkan notifikasi error
      console.error('Regex error:', error);
      return; // Hentikan eksekusi jika terjadi error
    }

    setCleanArticle(cleanArticle);

    if (!isPlaying) {
      showSnackbar(title, '#024D91'); // Tampilkan Snackbar menggunakan context
      Tts.setDefaultLanguage('id-ID');
      try {
        Tts.speak(cleanArticle);
      } catch (error) {
        showError('Terjadi kesalahan saat memulai TTS.'); // Tampilkan notifikasi error
        console.error('TTS error:', error);
      }
    } else {
      Tts.stop();
      hideSnackbar();
    }

    // Simulasi kesalahan dengan kemungkinan 20%
    if (Math.random() > 0.8) {
      showError('Terjadi kesalahan saat memutar artikel.'); // Tampilkan notifikasi kesalahan menggunakan context
    }

    // Toggle status pemutaran
    setIsPlaying(!isPlaying);
  };
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlaying ? styles.pauseButton : styles.playButton,
      ]}
      onPress={handlePress}>
      <View style={styles.content}>
        {isPlaying ? (
          <IcTtsArticlePause width={13} height={13} />
        ) : (
          <IcTtsArticlePlay width={15} height={15} />
        )}
        <Text
          style={[
            styles.buttonText,
            isPlaying ? styles.pauseText : styles.playText,
          ]}>
          {isPlaying ? 'Jeda' : 'Dengar'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playButton: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderColor: '#024D91',
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginLeft: 230,
    flexDirection: 'row',
  },
  pauseButton: {
    position: 'absolute',
    backgroundColor: '#024D91',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginLeft: 230,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'medium',
    marginLeft: 8,
    fontSize: 15,
  },
  playText: {
    color: '#024D91',
  },
  pauseText: {
    color: '#FFFFFF',
  },
});

export default TtsArticleButton;
