/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
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
import {AuthContext} from '../../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const TtsArticleButton = ({id, scrollY, isActive, onPress, article, title}) => {
  const {showSnackbar, hideSnackbar, setCleanArticle, visible, setId} =
    useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi
  const {mpUser} = useContext(AuthContext);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false); // Get playing state for the specific button
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false); // Get loading state for the specific button

  useEffect(() => {
    if (!visible) {
      dispatch(setPlaying({id, value: false})); // Pastikan tombol kembali ke "play" saat Snackbar disembunyikan
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
      .replace(/(\r\n|\n|\r)/g, '');
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

  const handleTtsButton = () => {
    if (mpUser?.subscription?.isExpired) {
      setShowSubscriptionModal(true);
    } else {
      handlePress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlaying ? styles.pauseButton : styles.playButton,
      ]}
      onPress={handleTtsButton}
      disabled={isLoading}>

    <Modal
        transparent={true}
        visible={showSubscriptionModal}
        animationType="fade"
        onRequestClose={() => setShowSubscriptionModal(false)}>
        <View style={styles.subscriptionOverlay}>
          <View style={styles.subscriptionContent}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              Anda perlu berlangganan MP Digital Premium untuk menggunakan fitur
              ini
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Subscription')}
              style={styles.subscribeButton}>
              <Text style={{color: 'white'}}>Berlangganan Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
