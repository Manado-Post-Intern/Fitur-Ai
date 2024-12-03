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

const TtsSnackbarButton = ({id}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.tts.isPlayingMap[id] || false);
  const isLoading = useSelector(state => state.tts.isLoadingMap[id] || false);
  const {cleanArticle} = useSnackbar();

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        console.log('TTS initialized successfully.');
      })
      .catch(err => {
        console.error('Error initializing TTS:', err.message);
        if (err.code === 'no_engine') {
          console.warn('No TTS engine found. Requesting installation.');
          Tts.requestInstallEngine();
          showError(
            'Tidak ada engine TTS yang ditemukan. Silakan instal untuk melanjutkan.',
          );
        } else {
          showError('Error inisialisasi TTS. Silakan coba lagi.');
        }
      });
  }, []);

  useEffect(() => {
    const handleTtsStart = () => {
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: true}));
    };

    const handleTtsFinish = () => {
      dispatch(setPlaying({id, value: false}));
    };

    const handleTtsCancel = () => {
      dispatch(setLoading({id, value: false}));
      dispatch(setPlaying({id, value: false}));
    };

    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handleTtsPress = () => {
    Tts.setDefaultLanguage('id-ID');
    if (cleanArticle) {
      if (isPlaying) {
        Tts.stop();
        dispatch(setPlaying({id, value: false}));
      } else {
        dispatch(setLoading({id, value: true}));
        Tts.speak(cleanArticle);
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
