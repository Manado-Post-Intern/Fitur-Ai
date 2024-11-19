import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView, // Import ScrollView
} from 'react-native';
import {
  IcSummarizeSpark,
  IcPopUpExit,
  IcPopUpPlay,
  IcSumStop,
} from '../../../assets';
import Tts from 'react-native-tts';
import {AuthContext} from '../../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {useErrorNotification} from '../../../context/ErrorNotificationContext';
import {summarizetext} from '../../../api';

const SummarizeFloatingButton = ({title, article}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const {mpUser} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const {showError} = useErrorNotification();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Tts.stop();
    setIsPlaying(false);
  };

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      // setIsPlaying(true);
      console.log('tts sedang start');
    });
    Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
      console.log('tts telah selesai diputar');
    });
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      console.log('mengcancel tts button');
    });
    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, [isPlaying]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected && isPlaying) {
        Tts.stop();

        showError('Connection lost. TTS playback stopped.');
      }
    });

    return () => unsubscribe();
  }, [isPlaying]);

  const togglePlayPause = () => {
    Tts.setDefaultLanguage('id-ID');
    if (!isConnected) {
      setModalVisible(false);
      showError('Oops! Sepertinya kamu tidak terhubung ke internet.');
      return;
    }
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
      console.log('tts stop');
    } else {
      if (summary) {
        Tts.stop();
        Tts.speak(summary);
        setIsPlaying(true);
        console.log('tts speak');
      }
    }
  };

  const fetchSummary = async () => {
    if (!isConnected) {
      showError(
        'Koneksi internet tidak tersedia. Mohon periksa jaringan Anda dan coba kembali.',
      );
      return;
    }
    setLoading(true);
    try {
      const cleanArticle = article
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '')
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
        .replace(/(\r\n|\n|\r)/g, '');

      const content = await summarizetext(cleanArticle);
      const filtering = content.replace(/-/g, '•');
      setSummary(filtering);
      console.log(`summary, ${filtering}`);
    } catch (error) {
      console.error(error);
      showError('Failed to fetch summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = () => {
    if (!isConnected) {
      showError('Koneksi terputus. Periksa jaringan Anda untuk melanjutkan.');
      return;
    }
    // if (mpUser?.subscription?.isExpired) {
    //   setModalVisible(false);
    //   setShowSubscriptionModal(true);
    // } else {
    fetchSummary();
    setModalVisible(true);
    toggleModal();
    // }
  };

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={handleSummarize}>
        <IcSummarizeSpark name="Spark" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showSubscriptionModal}
        animationType="fade"
        onRequestClose={() => setShowSubscriptionModal(false)}>
        <View style={styles.subscriptionOverlay}>
          <View style={styles.subscriptionContent}>
            <Text style={{color: 'black', textAlign: 'center'}}>
              Anda perlu berlangganan MP Digital Premium untuk menggunakan fitur
              ini
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Subscription')}
              style={styles.subscribeButton}>
              <Text style={{color: 'white'}}>Berlangganan Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={toggleModal}>
        <View style={styles.Overlay}>
          <View style={styles.Content}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <IcPopUpExit name="close" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text
                style={styles.titleText}
                numberOfLines={10}
                ellipsizeMode="tail">
                {title}
              </Text>
            </View>

            <ScrollView style={styles.Description}>
              {loading ? ( // Show loading indicator if loading is true
                <ActivityIndicator size="large" color="#005AAC" />
              ) : (
                <Text style={styles.bulletPoint}>{summary}</Text> // Show summary once loaded
              )}
            </ScrollView>

            {/* Tombol Play/Pause */}
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playPauseButton}>
              {isPlaying ? <IcSumStop size={24} /> : <IcPopUpPlay size={24} />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    zIndex: 1,
  },
  floatingButton: {
    backgroundColor: '#005AAC',
    borderRadius: 50,
    padding: 15,
    elevation: 10,
    shadowColor: '#0B7DE5',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
  },
  Overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  Content: {
    width: '85%',
    height: '75%',
    padding: '5%',
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'flex-start',
    position: 'relative',
    elevation: 8,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    marginLeft: '92%',
    marginTop: '5%',
    width: 75,
    height: 50,
  },
  titleContainer: {
    alignSelf: 'stretch',
    paddingRight: 40, // Padding to prevent overlap with close button
    marginBottom: 2,
  },
  titleText: {
    // position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: '10%',
    color: '#000000',
    paddingLeft: '10%',
    marginBottom: '-20%',
  },
  Description: {
    flex: 1,
    top: 1,
    marginVertical: '20%',
    marginRight: '5%',
    marginLeft: '5%',
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: 2,
    color: 'black',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  playPauseButton: {
    alignSelf: 'center',
    borderRadius: 50,
    marginTop: -40,
  },
  subscriptionOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  subscriptionContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  subscribeButton: {
    backgroundColor: '#005AAC',
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
  },
});

export default SummarizeFloatingButton;
