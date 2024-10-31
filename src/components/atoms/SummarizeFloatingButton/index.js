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
import {AuthContext} from '../../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const openAI = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Config.OPENAI_API}`,
  },
});

const SummarizeFloatingButton = ({title, article}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const {mpUser} = useContext(AuthContext);
  const navigation = useNavigation();

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
      // If the user is not subscribed, show a prompt to subscribe
      setModalVisible(false); // Close the summary modal if open
      setShowSubscriptionModal(true);
    } else {
      fetchSummary();
      setModalVisible(true);
    }
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
            <Text style={{color: '#005AAC', textAlign: 'center'}}>
              Anda perlu berlangganan MP Digital Premium untuk membaca MP
              Digital dan MP Koran
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
    position: 'absolute',
    marginLeft: '92%',
    marginTop: '5%',
    width: 75,
    height: 50,
  },
  titleContainer: {
    alignSelf: 'stretch',
    paddingRight: 40, // Padding to prevent overlap with close button
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
    marginTop: -50,
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
