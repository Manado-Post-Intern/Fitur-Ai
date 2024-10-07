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

const TtsSnackbarButton = () => {
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlaying);
  const isLoading = useSelector(state => state.tts.isLoading);
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
      dispatch(setLoading(false)); // Set loading false when TTS starts
      dispatch(setPlaying(true)); // Set playing true when TTS starts
    };
    
    const handleTtsProgress = () => {
      dispatch(setLoading(false)); // Set loading false when TTS starts
      dispatch(setPlaying(true)); // Set playing true when TTS starts
    };

    const handleTtsFinish = () => {
      dispatch(setPlaying(false)); // Set playing true when TTS starts
    };

    const handleTtsCancel = () => {
      dispatch(setLoading(false)); // Set loading false when TTS starts
      dispatch(setPlaying(false)); // Set playing true when TTS starts
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
  }, [isPlaying]);

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
        dispatch(setLoading(true));
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
