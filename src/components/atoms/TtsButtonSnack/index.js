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

const TtsSnackbarButton = ({isActive}) => {
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const {cleanArticle, isPlayingSnack, setIsPlayingSnack, isLoadingSnack, setIsLoadingSnack} =
    useSnackbar(); // Get content from SnackbarContext

  // useEffect(() => {
  //   if (!isActive) {
  //     setIsLoading(false);
  //     setIsPlaying(false); // Reset status jika tombol ini tidak aktif
  //   }
  // }, [isActive]);

  useEffect(() => {
    // Check TTS initialization status
    Tts.getInitStatus()
      .then(() => {
        setTtsReady(true); // TTS is ready to use
      })
      .catch(error => {
        console.error('TTS initialization failed:', error);
        setTtsReady(false); // Failed to initialize TTS
      });

    const handleTtsStart = () => {
      setIsPlayingSnack(true); // TTS is playing
      setIsLoadingSnack(false); // Stop loading when TTS starts
    };
    const handleTtsProgress = () => {
      setIsPlayingSnack(true); // Playback finished
      setIsLoadingSnack(false); // Ensure loading is stopped
    };

    const handleTtsFinish = () => {
      setIsPlayingSnack(false); // Playback finished
      setIsLoadingSnack(false); // Ensure loading is stopped
    };

    const handleTtsCancel = () => {
      setIsPlayingSnack(false); // Playback canceled
      setIsLoadingSnack(false); // Ensure loading is stopped
    };

    // Add event listeners for TTS events
    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-progress', handleTtsProgress);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    return () => {
      // Cleanup event listeners
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlayingSnack]);

  const handleTtsPress = () => {
    if (!ttsReady) {
      console.error('TTS is not ready.');
      return;
    }

    if (cleanArticle) {
      if (isPlayingSnack) {
        // Stop TTS if already playing
        Tts.stop(); // Stop TTS playback
      } else {
        setIsLoadingSnack(true); // Show loading when starting
        Tts.speak(cleanArticle); // Speak the content
      }
    } else {
      console.error('No content to play.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTtsPress}>
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TtsSnackbarButton;
