/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, RefreshControl} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {IcBackBlue, IcSend} from '../assets';
import IcSendFix from '../assets/icons/Icon-Send-Fix.svg';
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import Card from '../components/Card';
import Comment from '../components/Comment';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database
import auth from '@react-native-firebase/auth'; // Import Firebase Auth untuk mendapatkan user
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import ReportBottomSheet from '../components/ReportBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

const DetailStatus = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // State untuk melacak data post yang diambil dari navigasi dan Firebase
  const [post, setPost] = useState(route.params?.post || null);
  const postId = route.params?.postId || post?.id;

  // State untuk melacak teks komentar
  const [commentText, setCommentText] = useState('');

  // State untuk melacak user yang sedang login
  const [user, setUser] = useState(null);

  // State untuk menyimpan daftar komentar dari Firebase
  const [comments, setComments] = useState({});

  // State untuk melacak username yang sedang dibalas
  const [replyingTo, setReplyingTo] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [postedId, setPostedId] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!post && postId) {
      const postRef = database().ref(`forum/post/${postId}`);
      postRef.once('value').then(snapshot => {
        if (snapshot.exists()) {
          setPost(snapshot.val());
        }
      });
    }
  }, [postId, post]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const openBottomSheet = id => {
    // Step 2: Modify the function to accept an id
    setPostedId(id); // Store the id
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  // Dapatkan user dari Firebase Auth
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser({
        userId: currentUser.uid, // userId dari auth
        fullName: currentUser.displayName || 'Pengguna Tanpa Nama', // Nama user dari auth
        userProfile: currentUser.photoURL || null,
      });
    }
  }, []);

  // Dapatkan komentar dari Firebase Realtime Database
  useEffect(() => {
    const commentsRef = database().ref(`forum/post/${post.id}/comments`); // Path yang benar

    // Mendengarkan perubahan data komentar di Firebase
    const onValueChange = commentsRef.on('value', snapshot => {
      if (snapshot.exists()) {
        setComments(snapshot.val()); // Simpan data komentar di state
      } else {
        setComments({}); // Jika tidak ada komentar, set ke object kosong
      }
    });

    // Membersihkan listener saat komponen unmount
    return () => commentsRef.off('value', onValueChange);
  }, [post.id]);

  const sortedComments = Object.keys(comments)
    .map(commentId => ({
      id: commentId,
      ...comments[commentId],
    }))
    .sort((a, b) => b.commentDate - a.commentDate);

  // Fungsi untuk mengirim komentar ke Firebase
  const handleSendComment = async () => {
    if (!isConnected) {
      Alert.alert('Tidak ada koneksi internet', 'Coba lagi nanti.');
      return; // Tidak melanjutkan pengiriman komentar
    }

    if (commentText.length > 0 && user) {
      if (replyingTo) {
        const replyRef = database()
          .ref(`forum/post/${post.id}/comments/${replyingTo.commentId}/replies`)
          .push();

        const newReply = {
          userId: user.userId,
          fullName: user.fullName,
          value: commentText,
          userProfile: user.userProfile,
          likes: 0,
          commentDate: Date.now(),
        };

        try {
          await replyRef.set(newReply);
          console.log('Balasan berhasil dikirim:', newReply);
        } catch (error) {
          console.error('Error saat mengirim balasan:', error);
        }

        setReplyingTo(null);
      } else {
        const commentRef = database()
          .ref(`forum/post/${post.id}/comments`)
          .push();

        const newComment = {
          userId: user.userId,
          fullName: user.fullName,
          value: commentText,
          userProfile: user.userProfile,
          likes: 0,
          commentDate: Date.now(),
        };

        try {
          await commentRef.set(newComment);
          console.log('Komentar berhasil dikirim:', newComment);
        } catch (error) {
          console.error('Error saat mengirim komentar:', error);
        }
      }

      setCommentText('');
    } else if (!user) {
      console.log('User belum login');
    }
  };

  // Fungsi untuk mengambil ulang post dan komentar dari Firebase saat refresh

  // Fungsi untuk menangani klik tombol balas
  const handleReplyPress = (commentId, username) => {
    setReplyingTo({commentId, username});
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.backButtonStyle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Forum', {refresh: true})}>
              <IcBackBlue />
            </TouchableOpacity>
          </View>
          <Text style={styles.textPostingan}>Postingan</Text>
        </View>
        <ScrollView>
          <View style={styles.cardStyle}>
            {post && (
              <Card
                post={post}
                onReportPress={openBottomSheet}
                connection={isConnected}
              />
            )}
          </View>
          <Text style={styles.komentarTitle}>Komentar</Text>

          {/* Tampilkan komentar menggunakan map */}
          {sortedComments.length > 0 ? (
            sortedComments.map(comment => (
              <Comment
                postId={post.id}
                key={comment.id}
                commentId={comment.id}
                username={comment.fullName}
                value={comment.value}
                commentDate={comment.commentDate}
                userProfile={comment.userProfile}
                replies={comment.replies} // Tambahkan balasan
                onReplyPress={() =>
                  handleReplyPress(comment.id, comment.fullName)
                }
                connection={isConnected}
              />
            ))
          ) : (
            <Text style={styles.noCommentText}>Belum ada komentar.</Text>
          )}
        </ScrollView>
        {isBottomSheetVisible && (
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setBottomSheetVisible(false)}>
            <ReportBottomSheet onClose={closeBottomSheet} postedId={postedId} />
          </BottomSheet>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={
              replyingTo
                ? `Membalas ${replyingTo.username}...`
                : 'Masukkan komentar anda...'
            }
            style={styles.commentInput}
            multiline={true} // Mengizinkan multi-baris
            value={commentText}
            onChangeText={text => setCommentText(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendComment}
            disabled={commentText.length === 0}>
            {commentText.length === 0 ? (
              <IcSend style={styles.sendIcon} />
            ) : (
              <IcSendFix style={styles.sendIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 72,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButtonStyle: {
    right: 10,
  },
  textPostingan: {
    fontSize: 24,
    fontFamily: 'NotoSerifGeorgian-Bold',
    color: '#00599B',
    bottom: 3,
  },
  cardStyle: {
    alignItems: 'center',
  },
  komentarTitle: {
    fontSize: 20,
    color: '#373737',
    fontFamily: 'Inter-Bold',
    marginLeft: 15,
  },
  noCommentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    paddingRight: 50,
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    borderColor: '#66686A',
    marginHorizontal: 5,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#66686A',
    borderTopWidth: 0.2,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});
