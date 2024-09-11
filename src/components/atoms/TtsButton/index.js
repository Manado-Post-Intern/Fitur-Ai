import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect,useState} from 'react';
import {TouchableOpacity, StyleSheet,ActivityIndicator,View} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext'; // Import context
import {useErrorNotification} from '../../../context/ErrorNotificationContext';

// Dapatkan fungsi setCleanContent dari context
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const TTSButton = ({isActive, onPress, content}) => {
  const {showError} = useErrorNotification(); // Dapatkan fungsi showError dari context
  const {setCleanArticle} = useSnackbar(); // Dapatkan fungsi setCleanContent dari context
  const [isConnected, setIsConnected] = useState(true); // State untuk menyimpan status koneksi

  useEffect(() => {
    // Listener untuk memantau perubahan koneksi
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected); // Simpan status koneksi
    });

    // Unsubscribe saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  const handlePress = async () => {
    // Cek apakah ada koneksi internet
    if (!isConnected) {
      showError('Oops, cannot play article sound. Please try again.'); // Panggil showError
      return;
    }

    // Set bahasa default untuk TTS
    Tts.setDefaultLanguage('id-ID');

    if (content) {
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '');

      // Trigger Tts.speak atau Tts.stop berdasarkan isActive
      if (isActive) {
        Tts.stop();
      } else {
        try {
          Tts.speak(cleanContent);
        } catch (error) {
          Alert.alert('Error', 'Terjadi kesalahan saat menggunakan TTS.');
          console.error('TTS error:', error);
        }
      }
    } else {
      console.log('Content is undefined or null');
    }

    if (onPress) {
      onPress();
  const {setCleanArticle,visible} = useSnackbar(); // Dapatkan fungsi setCleanContent dari context
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [isPlaying, setIsPlaying] = useState(false); // State untuk play/pause

  // useEffect(() => {
  //   // Setiap kali visible berubah, jalankan logika ini
  //   if (visible) {
  //     // setIsPlaying(true);
  //     setIsLoading(false);
  //     console.log("tetap stick!");
  //   } else {
  //     setIsPlaying(false);
  //     console.log("kembali ke style dengar");
  //   }
  // }, [visible]); // Tambahkan visible sebagai dependency agar useEffect dipicu setiap kali visible berubah

  useEffect(() => {
    // Event listener ketika TTS mulai berbicara
    Tts.addEventListener('tts-start', () => {
      setIsLoading(false);  // Matikan loading ketika suara mulai berbunyi
      setIsPlaying(true);   // Atur tombol menjadi "Jeda"
      console.log("tts start");
    });
    // Event listener ketika TTS selesai berbicara
    Tts.addEventListener('tts-finish', () => {setIsPlaying(false)
      console.log("tts finish");
    });  // Suara selesai, atur tombol ke "Dengar"
    Tts.addEventListener('tts-cancel', () => {setIsPlaying(false)
      setIsLoading(false)
    console.log("tts cancel");});  // Jika dibatalkan, tombol kembali ke "Dengar"

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  const handlePress = () => {
    // if (isPlaying) {
    //   Tts.stop();  // Hentikan TTS jika sedang berjalan
    //   console.log("berhenti memutar");
    //   setIsLoading(false);
    // } else {
    //   if (content) {
    //     const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '').toLowerCase();  // Bersihkan konten
    //     Tts.setDefaultLanguage('id-ID');  // Set bahasa ke Indonesian
    //     setIsLoading(true);  // Tampilkan loading
    //     Tts.speak(cleanContent);  // Mulai TTS
    //     setCleanArticle(cleanContent);  // Kirim cleanContent ke context
    //     console.log("memutar");
    //   }
    // }
    setIsPlaying(!isPlaying);
    const cleanContent = content
      .replace(/<\/?[^>]+(>|$)/g, '')
      .toLowerCase()
      .replace(/manadopost\.id/gi, '');
    setCleanArticle(cleanContent);  // Kirim cleanContent ke context
    Tts.setDefaultLanguage('id-ID');  // Set bahasa ke Indonesian
    if (!isPlaying) {
      setIsLoading(true);  // Tampilkan loading
      Tts.speak(cleanContent);  // Mulai TTS
      console.log("memutar");
    } else{
      Tts.stop();  // Hentikan TTS jika sedang berjalan
      console.log("berhenti memutar");
    }
  
    // Panggil onPress jika ada
    onPress?.();
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
