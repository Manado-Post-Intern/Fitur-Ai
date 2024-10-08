/* eslint-disable react-hooks/exhaustive-deps */
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
  // const [isLoadingButton, setIsLoadingButton] = useState(false);
  // const [isPlayingButton, setIsPlayingButton] = useState(false);
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false); // Get playing state for the specific button
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false); // Get loading state for the specific button
  const [ttsReady, setTtsReady] = useState(false); // State to check if TTS is initialized
  const {hideSnackbar, setCleanArticle, visible, setId} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification();

  useEffect(() => {
    if (visible) {
      // setIsPlaying(true);
      console.log('berubah menjadi icon stop');
    } else {
      // setIsPlayingButton(false);
      dispatch(setPlaying({id, value: false}));
      // dispatch(setPlaying(!isPlaying));
      console.log('kembali menjadi icon play');
    }
  }, [visible]);

  useEffect(() => {
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
    if (!isActive) {
      dispatch(setPlaying({id, value: false}));
      dispatch(setLoading({id, value: false}));
    }
  }, [isActive]);

  useEffect(() => {
    // Checking TTS initialization status
    Tts.getInitStatus()
      .then(() => {
        setTtsReady(true); // TTS is ready
        console.log('TTS is initialized');
      })
      .catch(error => {
        console.error('TTS initialization failed:', error);
        setTtsReady(false); // TTS initialization failed
      });

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
      // Tts.removeAllListeners('tts-progress');
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

    if (!ttsReady) {
      console.error('TTS is not ready');
      return;
    }
    dispatch(resetAllTtsExcept(id));

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '')
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
        .replace(/(\r\n|\n|\r)/g, ' ');

      setId(id);
      setCleanArticle(cleanContent);

      // Set loading state for the new TTS
      dispatch(setLoading({id, value: true}));

      // Set the new TTS to speak
      Tts.setDefaultLanguage('id-ID');
      try {
        await Tts.stop();
        Tts.speak(cleanContent); // Speak the new content
        dispatch(setPlaying({id, value: true})); // Mark the new button as playing
      } catch (error) {
        console.error('Error during TTS:', error);
      } finally {
        dispatch(setLoading({id, value: false})); // Reset loading after speaking or error
      }
    }

    onPress?.();
  };
  return (
    <View style={styles.container}>
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
});

export default TTSButton;
