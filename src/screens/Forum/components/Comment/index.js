/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Gap} from '../../../../components';
import Reply from '../Reply';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'; // Firebase Realtime Database

const Comment = ({
  postId,
  commentId, // Unik untuk setiap komentar
  userId, // Identifikasi user yang melakukan like
  username,
  value,
  userProfile,
  onReplyPress,
  commentDate,
  replies, // Properti balasan
  connection,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State untuk mengelola status tombol

  // Key untuk menyimpan status liked di AsyncStorage berdasarkan commentId dan userId
  const storageKey = `liked_${commentId}_${userId}`;

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
          `forum/post/${postId}/comments/${commentId}/likes`,
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
  }, [storageKey, commentId, postId]);

  // Fungsi untuk meng-handle like/unlike
  const handleLikePress = async () => {
    if (isButtonDisabled) {
      return;
    } // Jika tombol dinonaktifkan, keluar dari fungsi
    setIsButtonDisabled(true); // Nonaktifkan tombol

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newLikedStatus));

      const commentLikesRef = database().ref(
        `forum/post/${postId}/comments/${commentId}/likes`,
      );
      const userLikeRef = database().ref(
        `users/${userId}/likedComments/${commentId}`,
      );

      if (newLikedStatus) {
        commentLikesRef.transaction(currentLikes => (currentLikes || 0) + 1);
        await userLikeRef.set(true);
      } else {
        commentLikesRef.transaction(currentLikes => (currentLikes || 0) - 1);
        await userLikeRef.remove();
      }
    } catch (error) {
      console.error('Failed to update like status', error);
    }

    // Mengatur timeout untuk mengaktifkan kembali tombol setelah 2 detik
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
          </View>
          <Text style={styles.commentValue}>{value}</Text>
        </View>
      </View>
      <View style={styles.userResponse}>
        <Text style={styles.commentHours}>{getTimeAgo(commentDate)}</Text>
        <TouchableOpacity onPress={handleLikePress} disabled={!connection}>
          <Text style={[styles.likeButton, liked && styles.liked]}>
            {liked ? `Suka(${likesCount})` : 'Suka'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReplyPress(username)}>
          <Text style={styles.replyButton}>Balas</Text>
        </TouchableOpacity>
      </View>

      {/* Render balasan jika ada */}
      {replies &&
        Object.keys(replies).map(replyId => (
          <Reply
            commentId={commentId}
            postId={postId}
            key={replyId}
            replyId={replyId}
            userId={replies[replyId].userId}
            username={replies[replyId].fullName}
            replyValue={replies[replyId].value}
            replyDate={replies[replyId].commentDate}
            userProfile={replies[replyId].userProfile}
          />
        ))}

      <Gap height={20} />
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentContainer: {
    width: 395,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 50,
    height: 50,
  },
  imageStyling: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    marginLeft: 17,
    top: 10,
  },
  contentContainer: {
    paddingBottom: 10,
    width: 320,
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
  commentValue: {
    width: 270,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    left: 10,
    top: 5,
  },
  userResponse: {
    flexDirection: 'row',
    left: 95,
    top: 10,
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
  liked: {
    color: '#39A5E1', // Warna berubah menjadi biru saat "liked"
  },
  replyButton: {
    marginLeft: 19,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});
