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

const TtsSnackbarButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const {cleanArticle} = useSnackbar(); // Get content from SnackbarContext

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
      setIsPlaying(true); // TTS is playing
      setIsLoading(false); // Stop loading when TTS starts
    };

    const handleTtsFinish = () => {
      setIsPlaying(false); // Playback finished
      setIsLoading(false); // Ensure loading is stopped
    };

    const handleTtsCancel = () => {
      setIsPlaying(false); // Playback canceled
      setIsLoading(false); // Ensure loading is stopped
    };

    // Add event listeners for TTS events
    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    return () => {
      // Cleanup event listeners
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const handleTtsPress = () => {
    if (!ttsReady) {
      console.error('TTS is not ready.');
      return;
    }

    if (cleanArticle) {
      if (isPlaying) {
        // Stop TTS if already playing
        Tts.stop(); // Stop TTS playback
      } else {
        setIsLoading(true); // Show loading when starting
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
