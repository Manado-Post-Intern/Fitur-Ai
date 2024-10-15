import React, {createContext, useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const ErrorNotificationContext = createContext();

export const ErrorNotificationProvider = ({children}) => {
  const [isErrorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTtsPlaying, setTtsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (isTtsPlaying && !state.isConnected) {
        stopTts(); // Fungsi untuk menghentikan TTS
        showError('Koneksi terputus, TTS dihentikan.'); // Menampilkan error
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isTtsPlaying]);

  const showError = message => {
    setErrorMessage(message);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000); // Sembunyikan setelah 3 detik
  };

  const stopTts = () => {
    // Logika untuk menghentikan TTS
    console.log('TTS dihentikan'); // Tambahkan logika penghentian TTS di sini
    setTtsPlaying(false);
  };

  const playTts = () => {
    // Logika untuk memulai TTS
    console.log('TTS dimulai'); // Tambahkan logika pemutaran TTS di sini
    setTtsPlaying(true);
  };

  return (
    <ErrorNotificationContext.Provider
      value={{isErrorVisible, errorMessage, showError, playTts, stopTts}}>
      {children}
    </ErrorNotificationContext.Provider>
  );
};

export const useErrorNotification = () => useContext(ErrorNotificationContext);
