import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {IcTtsArticlePlay, IcTtsArticlePause} from '../../../assets';
import {Snackbar} from 'react-native-paper';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';

const TtsArticleButton = ({scrollY, isActive, onPress, article}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {showSnackbar} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context

  const handlePress = () => {
    setIsPlaying(!isPlaying);
    // Bersihkan HTML tags dari artikel
    const cleanArticle = article
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '');

    if (!isPlaying) {
      showSnackbar('Mendengarkan artikel...', '#024D91'); // Tampilkan Snackbar menggunakan context
      Tts.speak(cleanArticle);
      console.log(cleanArticle);
    } else {
      showSnackbar('Pemutaran dijeda', '#024D91'); // Tampilkan Snackbar untuk jeda
      Tts.stop();
    }

    // Simulasi kesalahan dengan kemungkinan 20%
    if (Math.random() > 0.8) {
      showSnackbar('Terjadi kesalahan', 'red'); // Tampilkan Snackbar kesalahan menggunakan context
    }
  };

  return (
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
});

export default TtsArticleButton;
