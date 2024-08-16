import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {IcTtsArticlePlay, IcTtsArticlePause} from '../../../assets';
import {Snackbar} from 'react-native-paper';

const TtsArticleButton = ({scrollY, isActive, onPress}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);
  const [snackbarTop, setSnackbarTop] = useState(0);

  useEffect(() => {
    setSnackbarTop(scrollY);
  }, [scrollY]);

  const handlePress = () => {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      setSnackbarMessage('Mendengarkan artikel...');
      setSnackbarError(false);
      setShowSnackbar(true);
    } else {
      setSnackbarMessage('Pemutaran dijeda');
      setSnackbarError(false);
      setShowSnackbar(true);
    }
    if (Math.random() > 0.8) {
      setSnackbarMessage('Terjadi kesalahan');
      setSnackbarError(true);
      setShowSnackbar(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          isPlaying ? styles.pauseButton : styles.playButton,
        ]}
        onPress={handlePress}>
        <View style={styles.content}>
          {isPlaying ? (
            <IcTtsArticlePause width={13} height={13} />
          ) : (
            <IcTtsArticlePlay width={15} height={15} />
          )}
          <Text
            style={[
              styles.buttonText,
              isPlaying ? styles.pauseText : styles.playText,
            ]}>
            {isPlaying ? 'Jeda' : 'Dengar'}
          </Text>
        </View>
      </TouchableOpacity>

      {}
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={[
          styles.snackbar,
          snackbarError ? styles.snackbarError : styles.snackbarProgress,
        ]}
        wrapperStyle={[styles.snackbarWrapper, {top: snackbarTop}]}>
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  playButton: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderColor: '#024D91',
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginLeft: 230,
    flexDirection: 'row',
  },
  pauseButton: {
    position: 'absolute',
    backgroundColor: '#024D91',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginLeft: 230,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'medium',
    marginLeft: 8,
    fontSize: 15,
  },
  playText: {
    color: '#024D91',
  },
  pauseText: {
    color: '#FFFFFF',
  },
  snackbar: {
    position: 'absolute',
    marginTop: 'auto',
    marginHorizontal: 16,
    borderRadius: 10,
  },
  snackbarProgress: {
    backgroundColor: '#024D91',
  },
  snackbarError: {
    backgroundColor: 'red',
  },
  snackbarText: {
    color: '#FFFFFF',
  },
  snackbarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default TtsArticleButton;
