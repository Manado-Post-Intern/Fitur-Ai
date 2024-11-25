import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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
import NetInfo from '@react-native-community/netinfo';
import {useErrorNotification} from '../../../context/ErrorNotificationContext';
import { summarizetext } from '../../../api';

const SummarizeFloatingButton = ({title, article}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Tts.stop();
    setIsPlaying(false);
  };

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
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

      const content = await summarizetext(cleanArticle);
      const filtering = content.replace(/-/g, '•');
      setSummary(filtering);
      console.log(`summary, ${filtering}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = () => {
    fetchSummary();
    toggleModal();
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
            <Gap height={36} />
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
  titleContainer: {
    alignSelf: 'stretch',
    paddingRight: 40,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '15%',
    marginTop: '10%',
    color: '#000000',
    paddingLeft: '12%',
    paddingRight: '5%',
  },
  Description: {
    paddingTop: '30%',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
