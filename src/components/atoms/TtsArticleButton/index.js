/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
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
  const [isPlayingArticle, setIsPlayingArticle] = useState(false);
  const {showSnackbar, hideSnackbar, setCleanArticle} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi
  const [isLoadingArticle, setIsLoadingArticle] = useState(false); // State untuk loading

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
      setIsLoadingArticle(false); // Matikan loading ketika suara mulai berbunyi
      setIsPlayingArticle(true); // Atur tombol menjadi "Jeda"
    });
    // Event listener ketika TTS selesai berbicara
    Tts.addEventListener('tts-finish', () => setIsPlayingArticle(false)); // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {
      setIsPlayingArticle(false);
      setIsLoadingArticle(false);
    }); // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlayingArticle]);

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

    if (!isPlayingArticle) {
      showSnackbar(title, '#024D91');
      Tts.setDefaultLanguage('id-ID');
      setIsLoadingArticle(true);
      Tts.speak(cleanArticle);
      console.log("playing tts");
    } else {
      Tts.stop();
      hideSnackbar();
      console.log("stop tts");
    }

    // Toggle status pemutaran
    setIsPlayingArticle(!isPlayingArticle);
  };
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlayingArticle ? styles.pauseButton : styles.playButton,
      ]}
      onPress={handlePress}
      disabled={isLoadingArticle}>
      <View style={styles.content}>
        {isLoadingArticle ? (
          <ActivityIndicator size="small" color="#FFFAFA" /> // Tampilkan loading saat proses
        ) : isPlayingArticle ? (
          <IcTtsArticleStop width={13} height={13} />
        ) : (
          <IcTtsArticlePlay width={15} height={15} />
        )}
        <Text
          style={[
            styles.buttonText,
            isPlayingArticle ? styles.pauseText : styles.playText,
          ]}>
          {isPlayingArticle ? 'Berhenti' : 'Dengar'}
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
