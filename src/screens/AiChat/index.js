import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {TopBarAi} from './component'; // Assuming you have a TopBarAi component
import {theme} from '../../assets'; // Assuming you have a theme file

const AiChat = () => {
  const [message, setMessage] = useState(''); // State to hold the input message
  const [messages, setMessages] = useState([]); // State to hold sent messages

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessages = [...messages, {text: message, isUser: true}]; // Add user's message to state

      // Simulate AI response
      const aiResponse = 'Ini adalah respon otomatis dari AI'; // Ganti dengan logika atau API response sebenarnya
      newMessages.push({text: aiResponse, isUser: false});

      setMessages(newMessages); // Update state with both user message and AI response
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* Top Bar */}
      <TopBarAi />

      {/* Chat Area with Keyboard Avoidance */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Render previous messages */}
          {messages.map((msg, index) => (
            <View
              key={index}
              style={
                msg.isUser ? styles.userMessageBubble : styles.messageBubble
              }>
              <Text
                style={
                  msg.isUser ? styles.userMessageText : styles.messageText
                }>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Chat Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type here..."
            placeholderTextColor={theme.colors.grey1}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiChat;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    zIndex: 0,
    flex: 1,
    backgroundColor: theme.colors.white2,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Ensure space for input area
  },
  messageBubble: {
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: theme.colors.black,
  },
  userMessageBubble: {
    backgroundColor: theme.colors.skyBlue,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  userMessageText: {
    fontSize: 16,
    color: theme.colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderColor: theme.colors.white,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderColor: theme.colors.grey1,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: theme.colors.skyBlue,
    fontSize: 20,
  },
});
