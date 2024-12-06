import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import {generateText} from '../../api/index';
import LinearGradient from 'react-native-linear-gradient';
import {TopBarAi} from './component';
import NetInfo from '@react-native-community/netinfo';
import {useErrorNotification} from '../../context/ErrorNotificationContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {IcAiChatSend} from '../../assets';
import {memo} from 'react';
import Modal from 'react-native-modal';

const WelcomeScreen = memo(() => {
  const [displayedText, setDisplayedText] = useState('');
  const welcomeMessage = 'Haloo Selamat Datang, Silahkan Bertanya 😊';
  const typingSpeed = 40;

  useEffect(() => {
    let mounted = true;
    let index = 0;

    const typingInterval = setInterval(() => {
      if (mounted && index < welcomeMessage.length) {
        setDisplayedText(prev => prev + welcomeMessage[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => {
      mounted = false;
      clearInterval(typingInterval);
    };
  }, []);

  if (!displayedText) {
    return null;
  }

  return <Text style={styles.welcomeText}>{displayedText}</Text>;
});

const ChatAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const {showError} = useErrorNotification();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const showWelcome = messages.length === 0;

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    // Modal muncul otomatis ketika screen terbuka
    setModalVisible(true);
  }, []);

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      return;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      showError('Oops! Sepertinya kamu tidak terhubung ke internet.');
      return;
    }

    const userMessage = {role: 'user', content: prompt};
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setPrompt('');

    setLoading(true);
    try {
      const {text, sources} = await generateText(prompt);
      const botMessage = {role: 'bot', content: text, sources: sources};
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      showError('Terjadi kesalahan saat membuat respon. Silakan coba lagi.');
      const errorMessage = {
        role: 'bot',
        content: 'Error generating response. Please try again.',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    setLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <TopBarAi />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selamat Datang di Chat AI!</Text>
          <Text style={styles.modalText}>
            Anda dapat mengirimkan hingga 10 pesan per sesi. Setelah mencapai
            batas ini, silakan reset chat atau keluar dari aplikasi untuk
            melanjutkan.
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.contentContainer}>
        {showWelcome ? (
          <View style={styles.welcomeContainer}>
            <WelcomeScreen />
          </View>
        ) : (
          <KeyboardAwareScrollView
            style={styles.chatContainer}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({animated: true})
            }
            keyboardShouldPersistTaps="handled"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? styles.userBubbleContainer
                    : styles.botBubbleContainer,
                ]}>
                {message.role === 'user' ? (
                  <LinearGradient
                    colors={['#4479E1', '#2C4FB9']}
                    style={styles.userBubble}>
                    <Text
                      style={[
                        styles.userText,
                        isDarkMode && styles.darkTextUser,
                      ]}>
                      {message.content}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.botBubble}>
                    <Text
                      style={[styles.botText, isDarkMode && styles.darkText]}>
                      {message.content}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </KeyboardAwareScrollView>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          placeholder="Tulis pesan di sini..."
          placeholderTextColor={
            isDarkMode ? 'rgba(169, 169, 169, 0.6)' : 'rgba(85, 85, 85, 0.6)'
          }
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity
          onPress={handleGenerateText}
          disabled={!prompt.trim()}>
          <IcAiChatSend name="send" style={styles.send} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f0f5',
  },
  contentContainer: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: '#00599b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#004683',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatContainer: {
    padding: 20,
    height: '10%',
  },
  messageBubble: {
    marginBottom: 25,
    maxWidth: '80%',
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
  },
  botBubbleContainer: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    padding: 10,
    borderRadius: 10,
    elevation: 8,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    elevation: 8,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  botText: {
    color: '#000000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#F6F6F6',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    padding: 5,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    paddingLeft: 15,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    color: '#000000',
  },
  inputDark: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    color: '#000000',
  },
  sourceContainer: {
    marginTop: 5,
  },
  sourceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 10,
    paddingBottom: 5,
  },
  sourceLink: {
    fontSize: 12,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  darkText: {
    color: 'black',
  },
  darkTextUser: 'white',
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  welcomeText: {
    fontSize: 34,
    color: '#6496C2',
    marginHorizontal: '5%',
    textAlign: 'center',
    fontWeight: '500',
  },
  send: {
    marginTop: 3,
  },
});
export default ChatAI;
