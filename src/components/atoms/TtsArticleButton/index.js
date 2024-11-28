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
import {IcTtsArticlePlay, IcTtsArticleStop} from '../../../assets';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useErrorNotification} from '../../../context/ErrorNotificationContext'; // Import context
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {setPlaying, setLoading} from '../../../redux/ttsSlice';
import {AuthContext} from '../../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {textToSpeech} from '../../../api';

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
        showError('Koneksi internet terputus, fitur TTS dihentikan.'); // Tampilkan pesan error
      }
    });
    return () => unsubscribe();
  }, [isPlaying]);

  const handlePress = async () => {
    if (!isConnected) {
      showError('Oops, tidak bisa memutar suara artikel.');
      return;
    }
  
    const cleanArticle = article
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '')
      .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
      .replace(/(\r\n|\n|\r)/g, '');
  
    setId(id);
    setCleanArticle(cleanArticle);
    console.log('Berhasil menerima artikel:', cleanArticle);
  
    try {
      if (!isPlaying) {
        dispatch(setLoading({id, value: true}));
        const tts = await textToSpeech(cleanArticle);
        console.log('Playing TTS:', tts);
  
        // Jika `tts` adalah URL atau base64, log dan tes pemutaran
        if (tts) {
          console.log('Audio data received successfully.');
          // Tambahkan logika pemutaran audio di sini
        } else {
          console.error('No audio data received.');
        }
      } else {
        console.log('Stopping TTS');
      }
      dispatch(setPlaying({id, value: !isPlaying}));
    } catch (error) {
      console.error('Error in handlePress:', error.message);
      showError('Gagal memproses TTS.');
    }
  };

  const handleTtsButton = () => {
    if (mpUser?.subscription?.isExpired) {
      // hideSnackbar();
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
  subscriptionOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  subscriptionContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  subscribeButton: {
    backgroundColor: '#005AAC',
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
  },
});

export default TtsArticleButton;
