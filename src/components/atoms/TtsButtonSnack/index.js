/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import {IcTtsPlay, IcTtsStop} from '../../../assets';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {setPlaying, setLoading} from '../../../redux/ttsSlice';

const TtsSnackbarButton = ({id}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false);
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false);
  const [ttsReady, setTtsReady] = useState(false);
  const {cleanArticle} = useSnackbar(); // Get content from SnackbarContext

  useEffect(() => {
    // Periksa status inisialisasi TTS
    Tts.getInitStatus()
      .then(() => {
        console.log('TTS initialized successfully.');
      })
      .catch(err => {
        console.error('Error initializing TTS:', err.message);
        if (err.code === 'no_engine') {
          console.warn('No TTS engine found. Requesting installation.');
          Tts.requestInstallEngine(); // Meminta pengguna menginstal engine TTS
          showError(
            'Tidak ada engine TTS yang ditemukan. Silakan instal untuk melanjutkan.',
          );
        } else {
          showError('Error inisialisasi TTS. Silakan coba lagi.');
        }
      });

    // Tts.requestInstallData()
    //   .then(() => {
    //     console.log('TTS data installation requested.');
    //   })
    //   .catch(err => {
    //     console.error('Error requesting TTS data installation:', err.message);
    //     showError(
    //       'Tidak dapat meminta data TTS. Pastikan perangkat mendukung TTS.',
    //     );
    //   });
  }, []);

  useEffect(() => {
    // // Check TTS initialization status
    // Tts.getInitStatus()
    //   .then(() => {
    //     setTtsReady(true); // TTS is ready to use
    //     Tts.setDefaultLanguage('id-ID'); // Pastikan bahasa diatur ke Indonesia
    //     console.log('tts initialized');
    //   })
    //   .catch(error => {
    //     console.error('TTS initialization failed:', error);
    //     setTtsReady(false); // Failed to initialize TTS
    //   });

    const handleTtsStart = () => {
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: true}));
    };

    const handleTtsFinish = () => {
      dispatch(setPlaying({id, value: false}));
    };

    const handleTtsCancel = () => {
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: false}));
    };

    // Add event listeners for TTS events
    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    return () => {
      // Cleanup event listeners
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handleTtsPress = () => {
    if (!ttsReady) {
      // console.error('TTS is not ready.');
      return;
    }
    Tts.setDefaultLanguage('id-ID');
    if (cleanArticle) {
      if (isPlaying) {
        // Stop TTS if already playing
        Tts.stop(); // Stop TTS playback
        dispatch(setPlaying({id, value: false}));
      } else {
        // Tts.setDefaultLanguage('id-ID');
        dispatch(setLoading({id, value: true}));
        Tts.speak(cleanArticle); // Speak the content
      }
    } else {
      console.error('No content to play.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTtsPress}>
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TtsSnackbarButton;
