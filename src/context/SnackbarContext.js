import React, {createContext, useContext, useEffect, useState} from 'react';
import {Snackbar} from 'react-native-paper';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TTSButton from '../components/atoms/TtsButton'; // Pastikan jalur impor sesuai
import Tts from 'react-native-tts';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [textColor, setTextColor] = useState('white');
  const [cleanArticle, setCleanArticle] = useState(''); //State clean article
  const [isActive, setIsActive] = useState(false); // State untuk mengelola status TTS

  const showSnackbar = (msg, color = 'white') => {
    setMessage(msg);
    setTextColor(color);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
    Tts.stop();
  };

  const toggleSnackbar = () => {
    if (visible) {
      hideSnackbar();
    } else {
      showSnackbar('This is a persistent Snackbar!', 'yellow');
    }
  };

  const toggleTTS = () => {
    setIsActive(!isActive); // Toggle isActive state
    if (!isActive && cleanArticle) {
      Tts.speak(cleanArticle); // Ketika TTS diaktifkan, putar cleanArticle
    } else {
      Tts.stop(); // Stop TTS ketika di-deactivate
    }
  };

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        hideSnackbar,
        toggleSnackbar,
        cleanArticle,
        setCleanArticle,
        visible,
        setVisible,
      }}>
      {children}
      <View style={styles.snackbarWrapper}>
        <Snackbar
          visible={visible}
          onDismiss={() => {}}
          duration={Snackbar.DURATION_INDEFINITE}
          style={styles.snackbar}
          action={{
            label: (
              <View style={styles.actionStyle}>
                <TTSButton
                  isActive={isActive}
                  onPress={toggleTTS}
                  content={cleanArticle || 'tidak ada content'}
                />
                <TouchableOpacity onPress={hideSnackbar}>
                  <Text style={[styles.actionLabel, {color: textColor}]}>
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          }}>
          <Text style={[styles.snackbarText, {color: textColor}]}>
            {message}
          </Text>
        </Snackbar>
      </View>
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    bottom: 80,
    width: 180,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    left: '84%',
  },
  snackbarWrapper: {
    flexDirection: 'row',
    bottom: 16,
    left: 16,
    right: 16,
    position: 'absolute',
  },
  actionLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  snackbarText: {
    fontSize: 14,
  },
  actionStyle: {
    flexDirection: 'row',
  },
});

export default SnackbarProvider;
