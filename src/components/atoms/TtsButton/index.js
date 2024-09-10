import React, {useEffect,useState} from 'react';
import {TouchableOpacity, StyleSheet,ActivityIndicator,View} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext'; // Import context

const TTSButton = ({isActive, onPress, content}) => {
  const {setCleanArticle} = useSnackbar(); // Dapatkan fungsi setCleanContent dari context
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [isPlaying, setIsPlaying] = useState(false); // State untuk play/pause

  useEffect(() => {
    const handleTtsStart = () => {
      console.log('TTS started');
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleTtsFinish = () => {
      console.log('TTS finished');
      setIsPlaying(false);
      setIsLoading(false); // Pastikan loading berhenti
    };

    const handleTtsCancel = () => {
      console.log('TTS canceled');
      setIsPlaying(false);
      setIsLoading(false); // Pastikan loading berhenti
    };

    // Tambahkan listener
    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    // Hapus listener saat komponen unmount
    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const handlePress = () => {
    if (isPlaying) {
      console.log('Stopping TTS');
      Tts.stop();  // Jika sedang berbunyi, hentikan TTS
    } else {
      console.log('Starting TTS');
      // Set the default language to Indonesian
      Tts.setDefaultLanguage('id-ID');

      if (content) {
        // Bersihkan konten
        const cleanContent = content
          .replace(/<\/?[^>]+(>|$)/g, '')
          .toLowerCase()
          .replace(/manadopost\.id/gi, '');

        console.log('Clean content:', cleanContent);
        setCleanArticle(cleanContent); // Kirim cleanContent ke context
        setIsLoading(true);  // Tampilkan loading sebelum TTS berbunyi
        Tts.speak(cleanContent);  // Mulai TTS
      } else {
        console.log('Content is undefined or null');
      }
    }

    // Call the passed onPress function
    if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        {isLoading ? (  // Jika sedang loading, tampilkan ActivityIndicator
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          isPlaying ? (  // Jika sedang bermain, tampilkan tombol jeda
            <IcTtsPause width={24} height={24} />
          ) : (  // Jika tidak sedang bermain, tampilkan tombol dengar
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
