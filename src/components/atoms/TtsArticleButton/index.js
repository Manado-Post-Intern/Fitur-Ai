import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {IcTtsArticlePlay, IcTtsArticlePause} from '../../../assets';
import {Snackbar} from 'react-native-paper';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext';

const TtsArticleButton = ({scrollY, isActive, onPress, article, title}) => {
  const [isPlaying, setIsPlaying] = useState(false); // state untuk playing
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const {showSnackbar, hideSnackbar, setCleanArticle, visible, setVisible} = useSnackbar(); // Menggunakan fungsi showSnackbar dari context

  useEffect(() => {
    // Setiap kali visible berubah, jalankan logika ini
    if (visible) {
      setIsPlaying(true);
      console.log("tetap stick!");
    } else {
      setIsPlaying(false);
      console.log("kembali ke style dengar");
    }
  }, [visible]); // Tambahkan visible sebagai dependency agar useEffect dipicu setiap kali visible berubah


  useEffect(() => {
    // Event listener ketika TTS mulai berbicara
    Tts.addEventListener('tts-start', () => {
      setIsLoading(false);  // Matikan loading ketika suara mulai berbunyi
      setIsPlaying(true);   // Atur tombol menjadi "Jeda"
    });
    // Event listener ketika TTS selesai berbicara
    Tts.addEventListener('tts-finish', () => setIsPlaying(false));  // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {setIsPlaying(false) 
    
  setIsLoading(false)});  // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handlePress = () => {
    setIsPlaying(!isPlaying);
    // Bersihkan HTML tags dari artikel
    const cleanArticle = article
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '');

      setCleanArticle(cleanArticle);


    if (!isPlaying) {
      showSnackbar(title, '#024D91'); // Tampilkan Snackbar menggunakan context
      setIsLoading(true);
      Tts.speak(cleanArticle);
      
    } else {
      Tts.stop();
      hideSnackbar();
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
      {isLoading ? (
          <ActivityIndicator size="small" color="#FFFAFA" />  // Tampilkan loading saat proses
        ) : isPlaying ? (
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
