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

  return (
    <SafeAreaView style={styles.container}>
      <TopBarAi />
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
                <Text style={styles.userText}>{message.content}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.botBubble}>
                <Text style={styles.botText}>{message.content}</Text>
              </View>
            )}
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </KeyboardAwareScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tulis pesan di sini..."
          value={prompt}
          onChangeText={setPrompt}
        />
        <Button title="Kirim" onPress={handleGenerateText} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f0f5',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    marginBottom: 20,
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
});
export default ChatAI;
