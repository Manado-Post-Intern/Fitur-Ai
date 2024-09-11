/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator, View} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext'; // Import context
import {useErrorNotification} from '../../../context/ErrorNotificationContext'; 
import NetInfo from '@react-native-community/netinfo'; 

const TTSButton = ({isActive, onPress, content}) => {
  const {showError} = useErrorNotification(); // Get the showError function from context
  const {setCleanArticle, visible} = useSnackbar(); // Get setCleanArticle function from context
  const [isConnected, setIsConnected] = useState(true); // State for connection status
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [isPlaying, setIsPlaying] = useState(false); // State for play/pause

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      setIsLoading(false);
      setIsPlaying(true);
      console.log("tts start");
    });
    Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
      console.log("tts finish");
    });
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.log("tts cancel");
    });
    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handlePress = async () => {
    if (!isConnected) {
      showError('Oops, cannot play article sound. Please try again.');
      return;
    }

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '');

      setCleanArticle(cleanContent);
      Tts.setDefaultLanguage('id-ID');

      if (!isPlaying) {
        setIsLoading(true);
        Tts.speak(cleanContent);
        console.log("Playing TTS");
      } else {
        Tts.stop();
        console.log("Stopped TTS");
      }

      setIsPlaying(!isPlaying);
    } else {
      console.log('Content is undefined or null');
    }

    onPress?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          isPlaying ? (
            <IcTtsPause width={24} height={24} />
          ) : (
            <IcTtsPlay width={24} height={24} />
          )
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default TTSButton;