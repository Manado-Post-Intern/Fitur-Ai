/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  IcTtsArticlePlay,
  IcTtsArticlePause,
  IcTtsArticlePauseNew,
  IcTtsArticleStop,
} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useErrorNotification} from '../../../context/ErrorNotificationContext'; // Import context
import NetInfo from '@react-native-community/netinfo';

const TtsArticleButton = ({scrollY, isActive, onPress, article, title}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {showSnackbar, hideSnackbar, setCleanArticle, visible} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

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

  useEffect(() => {
    // Event listener ketika TTS mulai berbicara
    Tts.addEventListener('tts-start', () => {
      setIsLoading(false); // Matikan loading ketika suara mulai berbunyi
      setIsPlaying(true); // Atur tombol menjadi "Jeda"
    });
    // Event listener ketika TTS selesai berbicara
    Tts.addEventListener('tts-finish', () => setIsPlaying(false)); // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      setIsLoading(false);
    }); // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  // useEffect(() => {
  //   // Setiap kali visible berubah, jalankan logika ini
  //   if (visible) {
  //     setIsPlaying(true);
  //     console.log('tetap stick!');
  //   } else {
  //     setIsPlaying(false);
  //     setIsLoading(false);
  //     console.log('kembali ke style dengar');
  //   }
  // }, [visible]); // Tambahkan visible sebagai dependency agar useEffect dipicu setiap kali visible berubah

  const handlePress = async () => {
    // Cek apakah ada koneksi internet
    if (!isConnected) {
      showError('Oops, cannot play article sound. Please try again.'); // Tampilkan notifikasi error
      return;
    }

    // Bersihkan HTML tags dari artikel
    const cleanArticle = article
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '');

    setCleanArticle(cleanArticle);

    if (!isPlaying) {
      showSnackbar(title, '#024D91');
      Tts.setDefaultLanguage('id-ID');
      setIsLoading(true);
      Tts.speak(cleanArticle);
    } else {
      Tts.stop();
      hideSnackbar();
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
      onPress={handlePress}
      disabled={isLoading}>
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFAFA" /> // Tampilkan loading saat proses
        ) : isPlaying ? (
          <IcTtsArticleStop width={13} height={13} />
        ) : (
          <IcTtsArticlePlay width={15} height={15} />
        )}
        <Text
          style={[
            styles.buttonText,
            isPlaying ? styles.pauseText : styles.playText,
          ]}>
          {isPlaying ? 'Berhenti' : 'Dengar'}
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
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pauseButton: {
    position: 'absolute',
    backgroundColor: '#024D91',
    paddingVertical: 5,
    paddingHorizontal: 14.5,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'medium',
    marginLeft: 9,
    fontSize: 11,
  },
  playText: {
    color: '#024D91',
  },
  pauseText: {
    color: '#FFFFFF',
  },
});

export default TtsArticleButton;
