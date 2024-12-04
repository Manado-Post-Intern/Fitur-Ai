/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {IcOption, IcClose, IcBack, IcCheckbox} from '../../assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Gap} from '../../../../components';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {Dimensions} from 'react-native';
import {Alert} from 'react-native';

const ReportBottomSheet = ({onClose, postedId}) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState('main');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [reasonText, setReasonText] = useState('');
  const [statusText, setStatusText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const translateX = useSharedValue(300);
  const currentUser = auth().currentUser;
  const userId = currentUser ? currentUser.uid : null;
  const [postOwnerId, setPostOwnerId] = useState(null);
  const fullName = currentUser ? currentUser.displayName : '';
  const [ownerName, setOwnerName] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false); // State untuk tombol kirim

  const handleTextChange = text => {
    if (text.length <= 280) {
      setReasonText(text);
      setStatusText(text);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Bersihkan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(postedId);
    setSelectedPostId(postedId);
  }, [postedId]); // Memantau perubahan postedId

  const handleOptionPress = option => {
    setSelectedOption(option);
    setCurrentContent('detail');
    setIsDetailVisible(true);
    translateX.value = withTiming(0, {duration: 300}); // Animasi masuk
  };

  useEffect(() => {
    console.log(postedId);
    setSelectedPostId(postedId);

    // Query ke Firebase untuk mendapatkan userId dari postId yang diberikan
    const fetchPostOwner = async () => {
      try {
        const snapshot = await database()
          .ref(`forum/post/${postedId}`)
          .once('value');
        const postData = snapshot.val();
        if (postData && postData.userId) {
          setPostOwnerId(postData.userId); // Set userId dari pemilik post
          setOwnerName(postData.owner);
        } else {
          console.log('Post tidak ditemukan atau tidak memiliki userId.');
        }
      } catch (error) {
        console.error('Error fetching post owner:', error);
      }
    };

    if (postedId) {
      fetchPostOwner(); // Ambil userId pemilik postingan
    }
  }, [postedId]);

  const handleBackPress = () => {
    translateX.value = withTiming(500, {duration: 300}, () => {
      runOnJS(setIsDetailVisible)(false); // Menjalankan fungsi di luar UI thread
      runOnJS(setCurrentContent)('main'); // Menjalankan fungsi di luar UI thread
      runOnJS(setSelectedOption)('');
      runOnJS(setReasonText)('');
      runOnJS(setStatusText)('');
    });
  };

  const handleReportSubmission = async () => {
    console.log('Mulai mengirim laporan...');
    console.log('Selected Post ID:', postedId);
    if (!selectedOption || !postOwnerId || !postedId) {
      console.log('Data tidak lengkap:', {
        selectedOption,
        postOwnerId,
        postedId,
      });
      return;
    }

    const reportId = database().ref().child('forum/reported').push().key;

    const reportData = {
      postId: postedId, // ID postingan yang di-report
      ownerId: postOwnerId, // ID user pemilik postingan
      ownerName: ownerName,
      reportBy: fullName, // ID user yang melaporkan
      reason: selectedOption, // Alasan dari pilihan yang dipilih user
      detail: reasonText, // Detail tambahan yang diisi user
      reportDate: database.ServerValue.TIMESTAMP, // Waktu laporan
    };

    try {
      await database().ref(`forum/reported/${reportId}`).set(reportData);
      console.log('Laporan berhasil dikirim!');
      setIsModalVisible(true); // Menampilkan modal konfirmasi sukses
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleSendPress = () => {
    console.log('Tombol Kirim diklik');
    console.log('Selected Post ID:', postedId); // Debugging

    if (!isConnected) {
      // Tampilkan alert tanpa langsung men-disable tombol
      Alert.alert(
        'Network Error',
        'Tidak dapat mengirim, network error. Silakan cek koneksi Anda dan coba lagi.',
      );
      return;
    }

    // Jika terhubung ke jaringan, baru kirim laporan
    if (!isSendButtonDisabled) {
      handleReportSubmission();
      setIsSendButtonDisabled(true); // Disable tombol setelah kirim laporan
    }
  };

  const handleBackToTimeline = () => {
    setIsModalVisible(false);
    onClose();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  useEffect(() => {
    // Disable tombol jika reasonText kosong
    setIsSendButtonDisabled(!reasonText.trim());
  }, [reasonText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isDetailVisible && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <IcBack />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>Laporkan</Text>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <IcClose />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {!isDetailVisible && (
        <>
          <Text style={styles.mainTitle}>
            Mengapa anda melaporkan postingan ini?
          </Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('Berita palsu')}>
            <Text style={styles.optionText}>Berita palsu</Text>
            <IcOption style={styles.optionIcon} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('Perundungan atau pelecehan')}>
            <Text style={styles.optionText}>Perundungan atau pelecehan</Text>
            <IcOption style={styles.optionIcon} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('Pelanggaran privasi')}>
            <Text style={styles.optionText}>Pelanggaran privasi</Text>
            <IcOption style={styles.optionIcon} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('Spam')}>
            <Text style={styles.optionText}>Spam</Text>
            <IcOption style={styles.optionIcon} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress('Lainnya')}>
            <Text style={styles.optionText}>Lainnya</Text>
            <IcOption style={styles.optionIcon} />
          </TouchableOpacity>
        </>
      )}

      {isDetailVisible && (
        <Animated.View style={[styles.detailContainer, animatedStyle]}>
          <Text style={styles.detailTitle}>Anda akan mengirimkan laporan</Text>
          <Text style={styles.detailDescription}>
            Kami hanya akan menghapus postingan yang tidak sesuai dengan Standar
            Komunitas.
          </Text>

          <Gap height={10} />

          <Text style={styles.reportDetailTitle}>Rincian Laporan</Text>

          <View style={styles.selectedOptionContainer}>
            <Text style={styles.selectedOptionLabel}>
              Mengapa anda melaporkan postingan ini?
            </Text>
            <Text style={styles.selectedOption}>{selectedOption}</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Berikan kami penjelasan..."
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={reasonText}
              onChangeText={handleTextChange}
            />
            <Text style={styles.characterCount}>{statusText.length}/280</Text>
          </View>

          <Gap height={25} />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSendButtonDisabled || !reasonText.trim() || !isConnected) &&
                styles.sendButtonDisabled,
            ]}
            disabled={
              isSendButtonDisabled || !reasonText.trim() || !isConnected
            } // Disable hanya setelah kirim laporan
            onPress={handleSendPress}>
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.textAlertContainer}>
              <IcCheckbox />
              <Gap width={7} />
              <Text style={styles.modalText}>Laporan berhasil dikirim!</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleBackToTimeline}>
              <Text style={styles.modalButtonText}>Kembali ke Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReportBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 17,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 20,
  },
  backButton: {
    position: 'absolute',
    top: 6,
    left: 20,
    zIndex: 1, // Menambah zIndex untuk memastikan tombol ada di atas
  },
  separator: {
    height: 1,
    backgroundColor: '#ADA5A5',
    marginVertical: 5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginVertical: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  optionIcon: {
    marginRight: 10,
  },
  detailContainer: {
    flex: 1,
    paddingTop: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  reportDetailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  selectedOptionContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    padding: 10,
    paddingTop: 8,
    marginBottom: 20,
  },
  selectedOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  selectedOption: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 8,
    height: 150,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    height: '100%',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#00599B',
    paddingVertical: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  sendButtonDisabled: {
    backgroundColor: '#AAA',
  },
  characterCount: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 14,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },
  modalButton: {
    backgroundColor: '#00599B',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    width: 284,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  textAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: 10,
  },
});
