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

const TtsArticleButton = ({id, scrollY, isActive, onPress, article, title}) => {
  const {showSnackbar, hideSnackbar, setCleanArticle, visible, setId} =
    useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi

  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false); // Get playing state for the specific button
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false); // Get loading state for the specific button

  const [isLoadingArticle, setIsLoadingArticle] = useState(false); // State untuk loading

  useEffect(() => {
    if (!isActive) {
      setIsLoadingArticle(false);
      // setIsPlayingArticle(false); // Reset status jika tombol ini tidak aktif
    }
  }, [isActive]);

  useEffect(() => {
    if (visible) {
      // setIsPlaying(true);
      console.log('berubah menjadi icon stop');
    } else {
      // setIsPlayingArticle(false);
      dispatch(setPlaying({id, value: false}));
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
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: true}));
      console.log('tts telah diputar article');
    });

    Tts.addEventListener('tts-finish', () => {
      dispatch(setPlaying({id, value: false}));
      console.log('tts telah selesai diputar article');
    }); // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {
      dispatch(setPlaying({id, value: false}));
      dispatch(setLoading({id, value: false}));
      console.log('memcancel tts article');
    }); // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
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
    setId(id);
    setCleanArticle(cleanArticle);
    console.log('berhasil menerima article content');

    if (!isPlaying) {
      showSnackbar(title, '#024D91');
      Tts.setDefaultLanguage('id-ID');
      // setIsLoadingArticle(true);
      dispatch(setLoading({id, value: true}));
      Tts.speak(cleanArticle);
      console.log('playing tts');
    } else {
      Tts.stop();
      hideSnackbar();
      console.log('stop tts');
    }

    // Toggle status pemutaran
    dispatch(setPlaying({id, value: !isPlaying}));
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
