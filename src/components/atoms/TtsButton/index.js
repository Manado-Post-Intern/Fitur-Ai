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
import {setPlaying, setLoading} from '../../../redux/ttsSlice';

const TTSButton = ({isActive, onPress, content}) => {
  const [isConnected, setIsConnected] = useState(true);
  // const [isLoadingButton, setIsLoadingButton] = useState(false);
  // const [isPlayingButton, setIsPlayingButton] = useState(false);
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlaying);
  const isLoading = useSelector(state => state.tts.isLoading);
  const [ttsReady, setTtsReady] = useState(false); // State to check if TTS is initialized
  const {hideSnackbar, setCleanArticle, visible} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification();

  useEffect(() => {
    if (visible) {
      // setIsPlaying(true);
      console.log('berubah menjadi icon stop');
    } else {
      // setIsPlayingButton(false);
      dispatch(setPlaying(false));
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
      setLoading(false);
      setPlaying(false);
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
      // setIsLoading(false);
      // setIsPlaying(true);
      dispatch(setLoading(false)); // Set loading false when TTS starts
      dispatch(setPlaying(true)); // Set playing true when TTS starts
      console.log('tts sedang start');
    });
    // Tts.addEventListener('tts-progress', () => {
    //   // setIsPlaying(true);
    //   // setIsLoading(false);
    //   dispatch(setLoading(false)); // Set loading false when TTS starts
    //   dispatch(setPlaying(true)); // Set playing true when TTS starts
    //   console.log('sedang berbicara');
    // });
    Tts.addEventListener('tts-finish', () => {
      // setIsPlaying(false);
      dispatch(setPlaying(false)); // Set playing false when TTS finishes
      console.log('tts telah selesai diputar');
    });
    Tts.addEventListener('tts-cancel', () => {
      // setIsPlaying(false);
      // setIsLoading(false);
      dispatch(setPlaying(false)); // Set playing false when TTS cancels
      dispatch(setLoading(false)); // Set loading false when TTS cancels
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

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '')
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
        .replace(/(\r\n|\n|\r)/g, ' ');
      setCleanArticle(cleanContent);
      console.log('ketika content ada maka akan dilakukan pembersihan content');
      if (!isPlaying) {
        Tts.setDefaultLanguage('id-ID');
        Tts.stop();
        // setIsLoading(true);
        dispatch(setLoading(true));
        Tts.speak(cleanContent);
        console.log('tts sedang diputar');
      } else {
        Tts.stop();
        // hideSnackbar();
        console.log('stop tts button');
      }
      dispatch(setPlaying(!isPlaying));
      console.log('toggle change');
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
