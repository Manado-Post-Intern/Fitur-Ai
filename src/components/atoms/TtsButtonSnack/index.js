/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator, View} from 'react-native';
import {IcTtsPlay, IcTtsStop} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';
import NetInfo from '@react-native-community/netinfo';

const TTSButtonSnackbar = ({isActive, onPress, content}) => {
  const {setCleanArticle, showSnackbar} = useSnackbar();
  const [isConnected, setIsConnected] = useState(true);
  const [isLoadingSnack, setIsLoadingSnack] = useState(false);
  const [isPlayingSnack, setIsPlayingSnack] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log(`Internet connection: ${state.isConnected}`);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onTtsStart = () => {
      setIsLoadingSnack(false);
      setIsPlayingSnack(true);
      console.log('TTS started');
    };
  
    const onTtsFinish = () => {
      setIsPlayingSnack(false);
      console.log('TTS finished');
    };
  
    const onTtsCancel = () => {
      setIsPlayingSnack(false);
      setIsLoadingSnack(false);
      console.log('TTS cancelled');
    };
  
    Tts.addEventListener('tts-start', onTtsStart);
    Tts.addEventListener('tts-finish', onTtsFinish);
    Tts.addEventListener('tts-cancel', onTtsCancel);
  
    return () => {
      Tts.removeEventListener('tts-start', onTtsStart);
      Tts.removeEventListener('tts-finish', onTtsFinish);
      Tts.removeEventListener('tts-cancel', onTtsCancel);
    };
  }, [isPlayingSnack]);

  const handlePress = async () => {
    if (!isConnected) {
      showSnackbar('No internet connection.');
      return;
    }
  
    if (content) {
      const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '').toLowerCase();
      setCleanArticle(cleanContent);
      Tts.setDefaultLanguage('id-ID');
      console.log("content berhasil diterima");
  
      if (!isPlayingSnack) {
        setIsLoadingSnack(true);
        Tts.speak(cleanContent);
        console.log("memutar tts dari snackbar");
      } else {
        console.log('Stopping TTS');
        Tts.stop(); // Hentikan pemutaran TTS
      }
    } else {
      console.log('No content to read');
    }
  
    if (onPress) {
      onPress(); // Panggil onPress jika ada
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button} disabled={isLoadingSnack}>
        {isLoadingSnack ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : isPlayingSnack ? (
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

export default TTSButtonSnackbar;
