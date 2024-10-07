/* eslint-disable react-hooks/exhaustive-deps */
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
import {useDispatch, useSelector} from 'react-redux';
import {setPlaying, setLoading} from '../../../redux/ttsSlice';

const TtsArticleButton = ({scrollY, isActive, onPress, article, title}) => {
  // const [isPlayingArticle, setIsPlayingArticle] = useState(false);
  const {showSnackbar, hideSnackbar, setCleanArticle, visible} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi
  // const [isLoadingArticle, setIsLoadingArticle] = useState(false); // State untuk loading
  const dispatch = useDispatch();
  const {isPlaying, isLoading} = useSelector(state => state.tts);

  useEffect(() => {
    if (visible) {
      // setIsPlaying(true);
      console.log('berubah menjadi icon stop');
    } else {
      // setIsPlayingArticle(false);
      dispatch(setPlaying(false));
      console.log('kembali menjadi icon play');
    }
  }, [visible]);

  useEffect(() => {
    // Listener untuk memantau perubahan koneksi
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected && isPlaying) {
        Tts.stop(); // Stop TTS jika koneksi terputus
        showError('Koneksi internet terputus, fitur TTS dihentikan.'); // Tampilkan pesan error
      }
    });
    return () => unsubscribe();
  }, [isPlaying]);

  useEffect(() => {
    // Event listener ketika TTS mulai berbicara
    Tts.addEventListener('tts-start', () => {
      // setIsLoadingArticle(false); // Matikan loading ketika suara mulai berbunyi
      // setIsPlayingArticle(true); // Atur tombol menjadi "Jeda"
      dispatch(setLoading(false));
      dispatch(setPlaying(true));
      console.log('tts telah diputar article');
    });
    Tts.addEventListener('tts-progress', () => {
      // setIsLoadingArticle(false); // Matikan loading ketika suara mulai berbunyi
      // setIsPlayingArticle(true); // Atur tombol menjadi "Jeda"
      dispatch(setLoading(false));
      dispatch(setPlaying(true));
      console.log('tts sedang berjalan article');
    });
    // Event listener ketika TTS selesai berbicara
    Tts.addEventListener('tts-finish', () => {
      // setIsPlayingArticle(false);
      dispatch(setPlaying(false));
      console.log('tts telah selesai diputar article');
    }); // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {
      // setIsPlayingArticle(false);
      // setIsLoadingArticle(false);
      dispatch(setLoading(false));
      dispatch(setPlaying(false));
      console.log('memcancel tts article');
    }); // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handlePress = async () => {
    // Cek apakah ada koneksi internet
    if (!isConnected) {
      showError('Oops, tidak bisa memutar suara artikel.'); // Tampilkan notifikasi error
      return;
    }

    // Bersihkan HTML tags dari artikel
    const cleanArticle = article
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '')
      .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
      .replace(/(\r\n|\n|\r)/g, ' ');

    setCleanArticle(cleanArticle);
    console.log('berhasil menerima article content');

    if (!isPlaying) {
      showSnackbar(title, '#024D91');
      Tts.setDefaultLanguage('id-ID');
      // setIsLoadingArticle(true);
      dispatch(setLoading(true));
      Tts.speak(cleanArticle);
      console.log('playing tts');
    } else {
      Tts.stop();
      hideSnackbar();
      console.log('stop tts');
    }

    // Toggle status pemutaran
    dispatch(setPlaying(!isPlaying));
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
