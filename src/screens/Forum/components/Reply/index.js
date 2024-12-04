/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {IcWarning, IMGprofile} from '../../assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Gap} from '../../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'; // Firebase Realtime Database

const Reply = ({
  postId,
  userId,
  replyId,
  replyValue,
  username,
  replyDate,
  userProfile,
  commentId,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State untuk mengelola status tombol

  // Key untuk menyimpan status liked di AsyncStorage berdasarkan commentId dan userId
  const storageKey = `liked_${replyId}_${userId}`;

  // Mendapatkan status like dari database saat pertama kali render
  useEffect(() => {
    const getLikedStatus = async () => {
      try {
        const savedLikedStatus = await AsyncStorage.getItem(storageKey);
        if (savedLikedStatus !== null) {
          setLiked(JSON.parse(savedLikedStatus));
        }

        // Ambil jumlah likes dari Realtime Database berdasarkan commentId
        const likesRef = database().ref(
          `forum/post/${postId}/comments/${commentId}/replies/${replyId}/likes`,
        );
        likesRef.on('value', snapshot => {
          const count = snapshot.val() || 0;
          setLikesCount(count); // Hanya likes untuk commentId ini yang diambil
        });
      } catch (error) {
        console.error('Failed to load liked status', error);
      }
    };

    getLikedStatus();
  }, [storageKey, commentId, postId, replyId]);

  // Fungsi untuk meng-handle like/unlike
  const handleLikePress = async () => {
    if (isButtonDisabled) {
      return;
    } // Jika tombol dinonaktifkan, keluar dari fungsi
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    try {
      // Simpan status liked di AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(newLikedStatus));

      // Update jumlah likes di Firebase Realtime Database
      const commentLikesRef = database().ref(
        `forum/post/${postId}/comments/${commentId}/replies/${replyId}/likes`,
      );
      const userLikeRef = database().ref(
        `users/${userId}/likedReply/${replyId}`,
      );

      if (newLikedStatus) {
        // Jika di-like, tambahkan 1 like untuk commentId ini
        commentLikesRef.transaction(currentLikes => (currentLikes || 0) + 1);
        await userLikeRef.set(true); // Tandai bahwa user sudah like komentar ini
      } else {
        // Jika di-unlike, kurangi 1 like untuk commentId ini
        commentLikesRef.transaction(currentLikes => (currentLikes || 0) - 1);
        await userLikeRef.remove(); // Hapus status like dari user untuk commentId ini
      }
    } catch (error) {
      console.error('Failed to update like status', error);
    }
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000);
  };
  const getTimeAgo = timestamp => {
    const now = Date.now();
    const timeDifference = now - timestamp;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (seconds < 10) {
      return 'Baru saja';
    } else if (seconds < 60) {
      return `${seconds} d`;
    } else if (minutes < 60) {
      return `${minutes} m`;
    } else if (hours < 24) {
      return `${hours} j`;
    } else {
      return `${days} h`;
    }
  };

  return (
    <View>
      <View style={styles.commentContainer}>
        <View style={styles.imageContainer}>
          <Image source={{uri: userProfile}} style={styles.imageStyling} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.username}>
            <Text style={styles.usernameStyle}>{username}</Text>
            {/* <View style={styles.warningStyle}>
              <TouchableOpacity>
                <IcWarning />
              </TouchableOpacity>
            </View> */}
          </View>
          <Text style={styles.commentValue}>{replyValue}</Text>
        </View>
      </View>
      <View style={styles.userResponse}>
        <Text style={styles.commentHours}>{getTimeAgo(replyDate)}</Text>
        <TouchableOpacity onPress={handleLikePress}>
          <Text style={[styles.likeButton, liked && styles.liked]}>
            {liked ? `Suka(${likesCount})` : 'Suka'}
          </Text>
        </TouchableOpacity>
      </View>
      <Gap height={5} />
    </View>
  );
};

export default Reply;

const styles = StyleSheet.create({
  commentContainer: {
    top: 10,
    left: 68,
    width: 395,
    flexDirection: 'row',
    bottom: 10,
  },
  imageContainer: {
    width: 36,
    height: 36,
  },
  imageStyling: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    marginLeft: 17,
    top: 10,
  },
  contentContainer: {
    width: 265,
    paddingBottom: 10,
    backgroundColor: '#F1F2F6',
    borderRadius: 8,
    marginLeft: 30,
    top: 10,
  },
  username: {
    flexDirection: 'row',
    top: 4,
  },
  usernameStyle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#373737',
    left: 10,
  },
  warningStyle: {
    position: 'absolute',
    right: 6,
  },
  commentValue: {
    width: 250,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#373737',
    left: 10,
    top: 5,
  },
  userResponse: {
    flexDirection: 'row',
    left: 150,
    top: 20,
  },
  commentHours: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  likeButton: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 19,
  },
  replyButton: {
    marginLeft: 19,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  liked: {
    color: '#39A5E1', // Warna berubah menjadi biru saat "liked"
  },
});
