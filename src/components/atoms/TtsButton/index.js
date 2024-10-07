/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
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

const TTSButton = ({isActive, onPress, content, disabled}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsReady, setTtsReady] = useState(false); // State to check if TTS is initialized
  const {setCleanArticle, visible, setIsActive, setIsPlayingSnack, setIsLoadingSnack} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context
  const {showError} = useErrorNotification();
  useEffect(() => {
    if (visible) {
      // setIsPlaying(true);
      console.log('berubah menjadi icon stop');
    } else {
      setIsPlaying(false);
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
      setIsLoading(false);
      setIsPlaying(false); // Reset status jika tombol ini tidak aktif
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
      setIsLoading(false);
      setIsPlaying(true);
      console.log('tts sedang start');
    });
    // Tts.addEventListener('tts-progress', () => {
    //   setIsPlaying(true);
    //   setIsLoading(false);
    //   console.log('sedang berbicara');
    // });
    Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
      console.log('tts telah selesai diputar');
    });
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      setIsLoading(false);
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
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '');
      setIsActive(isActive);
      setCleanArticle(cleanContent);
      console.log('ketika content ada maka akan dilakukan pembersihan content');
      if (!isPlaying) {
        Tts.setDefaultLanguage('id-ID');
        Tts.stop();
        setIsLoading(true);
        Tts.speak(cleanContent);
        console.log('tts sedang diputar');
      } else {
        Tts.stop();
        console.log('stop tts button');
      }
      setIsPlaying(!isPlaying);
      console.log('set !!isplaying');
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
