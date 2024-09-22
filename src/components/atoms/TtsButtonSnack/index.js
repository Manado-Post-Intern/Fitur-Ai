/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator, View} from 'react-native';
import {IcTtsPlay, IcTtsStop} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';
import NetInfo from '@react-native-community/netinfo';

const TTSButtonSnackbar = ({isActive, onPress, content}) => {
  const {setCleanArticle, showSnackbar} = useSnackbar();
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log(`Internet connection: ${state.isConnected}`);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onTtsStart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      console.log('TTS started');
    };
  
    const onTtsFinish = () => {
      setIsPlaying(false);
      console.log('TTS finished');
    };
  
    const onTtsCancel = () => {
      setIsPlaying(false);
      setIsLoading(false);
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
  }, [isPlaying]);

  const handlePress = async () => {
    if (!isConnected) {
      showSnackbar('No internet connection.');
      return;
    }
  
    if (content) {
      const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '').toLowerCase();
      setCleanArticle(cleanContent);
      Tts.setDefaultLanguage('id-ID');
  
      if (!isPlaying) {
        setIsLoading(true);
        console.log('Starting TTS with content:', cleanContent);
        try {
          await Tts.speak(cleanContent); // Add async handling to wait for the speaking process
          console.log('TTS speak executed successfully');
        } catch (error) {
          console.error('Error during TTS execution:', error);
        }
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
      <TouchableOpacity onPress={handlePress} style={styles.button} disabled={isLoading}>
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

export default TTSButtonSnackbar;
