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
import axios from 'axios';
import Tts from 'react-native-tts';
import Config from 'react-native-config';
import { AuthContext } from '../../../context/AuthContext';
import { openai_api_url } from '../../../api';

const openAI = axios.create({
  baseURL: `${openai_api_url}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Config.OPENAI_API}`,
  },
});

const SummarizeFloatingButton = ({title, article, navigation}) => {
  const { mpUser } = useContext(AuthContext); // Access the subscription status from AuthContext
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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

  const togglePlayPause = () => {
    Tts.setDefaultLanguage('id-ID');
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
      console.log('tts stop');
    } else {
      if (summary) {
        Tts.stop();
        Tts.setDefaultLanguage('id-ID');
        Tts.speak(summary);
        setIsPlaying(true);
        console.log('tts speak');
      }
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const cleanArticle = article
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '')
        .replace(/[^a-zA-Z0-9.,!? /\\]/g, '')
        .replace(/(\r\n|\n|\r)/g, '');

      const prompt = `dari berita ini saya mau kamu hanya bahas point penting dari beritanya saja, buat jadi bullet yang menjelaskan beritanya tanpa harus kamu bold point pentingnya, batasan bulletnya hanya 3 sampai 5 tergantun panjang beritanya saja, dan nanti panjang bulletin beritanya jadikan hanya 15 kata saja."${cleanArticle}"`;

      const response = await openAI.post('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [{role: 'user', content: prompt}],
        max_tokens: 500,
      });

      const content = response.data.choices[0].message.content;
      const filtering = content.replace(/-/g, '•');
      setSummary(filtering); // Set hasil summary
      console.log(`summary, ${response.data.choices[0].message.content}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = () => {
    if (mpUser?.subscription?.isExpired) {
      setShowSubscriptionModal(true);
    } else {
      fetchSummary();
      toggleModal();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={handleSummarize}>
        <IcSummarizeSpark name="Spark" />
      </TouchableOpacity>

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
            <Text style={styles.titleText}>{title}</Text>

            <ScrollView style={styles.Description}>
              {loading ? (
                <ActivityIndicator size="large" color="#005AAC" />
              ) : (
                <Text style={styles.bulletPoint}>{summary}</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playPauseButton}>
              {isPlaying ? <IcSumStop size={24} /> : <IcPopUpPlay size={24} />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <View style={styles.subscriptionOverlay}>
          <View style={styles.subscriptionContainer}>
            <Text style={styles.subscriptionText}>
              Untuk mengakses fitur ini Anda perlu berlangganan.
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => {
                setShowSubscriptionModal(false);
                navigation.navigate('Subscription');
              }}>
              <Text style={styles.subscribeButtonText}>Berlangganan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 30,
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
  },
  closeButton: {
    // position: 'absolute',
    marginLeft: '86%',
    width: 75,
    height: 50,
  },
  titleText: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: '10%',
    marginTop: '10%',
    color: '#000000',
    paddingLeft: '10%',
  },
  Description: {
    top: 20,
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
    marginTop: -50,
  },subscriptionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscriptionText: {
    color: '#005AAC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: '#005AAC',
    padding: 10,
    borderRadius: 5,
  },
  subscribeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default SummarizeFloatingButton;
