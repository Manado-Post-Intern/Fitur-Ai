/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Animated,
} from 'react-native';
import {generateText} from '../../api/index';
import LinearGradient from 'react-native-linear-gradient';
import {TopBarAi} from './component';
import NetInfo from '@react-native-community/netinfo';
import {useErrorNotification} from '../../context/ErrorNotificationContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ChatAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const {showError} = useErrorNotification();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [displayedText, setDisplayedText] = useState('');
  const welcomeMessage =
    'Hai Selamat Datang, Silahkan Bertanya akan Saya Jawab:)';
  const typingSpeed = 50; // Adjust typing speed in milliseconds

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < welcomeMessage.length) {
        setDisplayedText(prev => prev + welcomeMessage[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval); // Clear interval on unmount
  }, []);

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      return;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      showError('Tidak ada koneksi internet. Silakan periksa jaringan Anda.');
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

  // Bubble Chat dengan Animasi
  const AnimatedBubble = React.memo(({ children , role, index, isLastMessage}) => {
    // Jika role adalah 'user', bubble akan muncul dengan animasi
    const scaleAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      if (isLastMessage) {
        // Hanya animasi jika ini adalah pesan terakhir
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      } else {
        scaleAnim.setValue(1); // Set value ke 1 tanpa animasi
      }
    }, [isLastMessage]);
    
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          marginBottom: 25,
          maxWidth: '80%',
        }}>
        {children}
      </Animated.View>
    );
  });
  

  return (
    <SafeAreaView style={styles.container}>
      <TopBarAi />
      <View style={styles.contentContainer}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, isDarkMode && styles.darkText]}>
              {displayedText}
            </Text>
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
                <AnimatedBubble
    key={`bubble-${index}`}
    role={message.role}
    index={index}
    isLastMessage={index === messages.length - 1}>
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
                </AnimatedBubble>
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
          placeholderTextColor={isDarkMode ? '#A9A9A9' : '#555555'}
          value={prompt}
          onChangeText={setPrompt}
        />
        <Button
          title="Kirim"
          onPress={handleGenerateText}
          disabled={!prompt.trim()}
        />
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
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    color: '#000000', // Ensure the text is visible in light mode
  },
  inputDark: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    color: '#000000', // Text color for dark mode
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
    paddingHorizontal: '1%',
  },
  welcomeText: {
    fontSize: 24,
    color: '#555',
    marginHorizontal: '7%',
  },
});
export default ChatAI;
