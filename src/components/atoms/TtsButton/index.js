import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {IcTtsPlay, IcTtsStop} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';
import NetInfo from '@react-native-community/netinfo';
import {useErrorNotification} from '../../../context/ErrorNotificationContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  setPlaying,
  setLoading,
  resetAllTtsExcept,
} from '../../../redux/ttsSlice';

const TTSButton = ({id, isActive, onPress, content}) => {
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false);
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false);
  const {hideSnackbar, setCleanArticle, visible, setId} = useSnackbar();
  const {showError} = useErrorNotification();

  useEffect(() => {
    if (visible) {
    } else {
      dispatch(setPlaying({id, value: false}));
    }
  }, [visible]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected && isPlaying) {
        Tts.stop();
        showError('Koneksi internet terputus, fitur TTS dihentikan.');
      }
    });
    return () => unsubscribe();
  }, [isPlaying]);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        console.log('TTS initialized successfully.');
      })
      .catch(err => {
        console.error('Error initializing TTS:', err.message);
        if (err.code === 'no_engine') {
          console.warn('No TTS engine found. Requesting installation.');
          Tts.requestInstallEngine();
          showError(
            'Tidak ada engine TTS yang ditemukan. Silakan instal untuk melanjutkan.',
          );
        } else {
          showError('Error inisialisasi TTS. Silakan coba lagi.');
        }
      });
  }, []);

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: true}));
      console.log('tts sedang start');
    });
    Tts.addEventListener('tts-finish', () => {
      dispatch(setPlaying({id, value: false}));
      console.log('tts telah selesai diputar');
    });
    Tts.addEventListener('tts-cancel', () => {
      dispatch(setPlaying({id, value: false}));
      dispatch(setLoading({id, value: false}));
      console.log('mengcancel tts button');
    });
    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handlePress = async () => {
    if (!isConnected) {
      console.error('No internet connection.');
      showError('Oops! Sepertinya kamu tidak terhubung ke internet.');
      return;
    }

    dispatch(resetAllTtsExcept(id));
    console.log('reset id');

    if (isPlaying) {
      Tts.stop();
      hideSnackbar();
      return;
    }

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '')
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
        .replace(/(\r\n|\n|\r)/g, '');

      setId(id);
      setCleanArticle(cleanContent);
      Tts.setDefaultLanguage('id-ID');

      dispatch(setLoading({id, value: true}));
      console.log('set loading true');

      try {
        await Tts.stop();
        Tts.speak(cleanContent);
        dispatch(setPlaying({id, value: true}));
        console.log('try button tts');
      } catch (error) {
        console.error('Error during TTS:', error);
      } finally {
        dispatch(setLoading({id, value: true}));
        console.log('finally button tts');
      }
      dispatch(setPlaying({id, value: !isPlaying}));
    }
    onPress?.();
  };
  return (
    <View style={styles.container}>
    
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

      <TouchableOpacity
        onPress={handlePress}
        style={styles.button}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : isPlaying ? (
          <IcTtsStop width={24} height={24} />
        ) : (
          <IcTtsPlay width={24} height={24} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  subscriptionOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default TTSButton;
