import React, {useContext, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Text,
} from 'react-native';
import {IcAiChat, theme} from '../../../assets';
import {AuthContext} from '../../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const AiChatButton = () => {
  const {mpUser} = useContext(AuthContext);
  const navigation = useNavigation();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handlePress = () => {
    if (mpUser?.subscription?.isExpired) {
      setShowSubscriptionModal(true);
    } else {
      navigation.navigate('AiChat');
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.iconWrapper}>
          <IcAiChat />
        </View>
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
    </View>
  );
};

export default AiChatButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: '5%',
    transform: [{translateY: -70}],
    width: 53,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#1463AB',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
        shadowColor: '#1463AB',
      },
    }),
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#005AAC',
    borderRadius: 5,
  },
});
