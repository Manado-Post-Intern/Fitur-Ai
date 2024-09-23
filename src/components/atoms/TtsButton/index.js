/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator, View} from 'react-native';
import {IcTtsPlay, IcTtsStop} from '../../../assets';
import Tts from 'react-native-tts';
import { useSnackbar } from '../../../context/SnackbarContext';
import NetInfo from '@react-native-community/netinfo';

const TTSButton = ({isActive, onPress, content,disabled}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const {setCleanArticle,visible} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context



  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      setIsLoading(false);
      setIsPlaying(true);
    });
    Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
    });
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      setIsLoading(false);
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
      return;
    }

    if (content) {
      const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '');
      setCleanArticle(cleanContent);
      Tts.setDefaultLanguage('id-ID');
      if (!isPlaying) {
        setIsLoading(true);
        Tts.speak(cleanContent);
      } else {
        Tts.stop();
      }
      setIsPlaying(!isPlaying);
    }
    onPress?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button} disabled={isLoading || disabled}>
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
