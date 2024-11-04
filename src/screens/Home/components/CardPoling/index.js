/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {IcGanti, Icrefreshpoll, theme} from '../../../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {Gap} from '../../../../components';
import NetInfo from '@react-native-community/netinfo';

const POLL_STORAGE_KEY = '@polling_result';

const CardPoling = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollData, setPollData] = useState({
    totalVotes: 0,
    options: [],
    hasVoted: false,
    selectedOption: null,
    title: '',
  });
  const [userId, setUserId] = useState(null);

  const fetchImageURL = async imageName => {
    try {
      const path = `images/polling/${imageName}`;
      //console.log(`Fetching image from path: ${path}`);
      const url = await storage().ref(path).getDownloadURL();
      //console.log(`Successfully fetched image URL for: ${imageName}`);
      return url;
    } catch (error) {
      console.error(`Error fetching image URL for ${imageName}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadPollingData = async () => {
      try {
        // Fetch polling title dynamically
        const pollingTitleSnapshot = await database()
          .ref('polling/title')
          .once('value');
        const title = pollingTitleSnapshot.val();

        setPollData(prevState => ({
          ...prevState,
          title: title,
        }));
      } catch (error) {
        console.error('Error loading polling title:', error);
      }
    };

    loadPollingData();
  }, []);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          setUserId(currentUser.uid);
        }

        const snapshot = await database()
          .ref('polling/candidates')
          .once('value');
        const candidates = snapshot.val();

        let options = await Promise.all(
          Object.keys(candidates).map(async candidate => {
            const imageName =
              candidates[candidate].imageName || `${candidate}.png`;
            const imageUrl = await fetchImageURL(imageName);

            return {
              text: candidate,
              votes: candidates[candidate].votes,
              image: imageUrl,
            };
          }),
        );

        // Memindahkan kandidat "Lainnya" ke bagian terakhir
        options = options.sort((a, b) => {
          if (a.text === 'Lainnya') {
            return 1;
          }
          if (b.text === 'Lainnya') {
            return -1;
          }
          return 0;
        });

        const totalVotes = options.reduce(
          (sum, option) => sum + option.votes,
          0,
        );

        setPollData(prevState => ({
          ...prevState,
          options,
          totalVotes,
        }));

        const userVoteSnapshot = await database()
          .ref(`polling/users/${currentUser.uid}`)
          .once('value');
        if (userVoteSnapshot.exists()) {
          const userVoteData = userVoteSnapshot.val();
          const selectedOption = options.findIndex(
            option => option.text === userVoteData.selectedCandidate,
          );

          setPollData(prevState => ({
            ...prevState,
            hasVoted: true,
            selectedOption,
          }));
        }
      } catch (error) {
        console.error('Error loading candidates or user data:', error);
      }
    };

    loadCandidates();
  }, []);

  const handleVote = async index => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert(
        'Tidak ada koneksi',
        'Anda tidak dapat melakukan vote tanpa koneksi internet.',
      );
      return;
    }
    if (pollData.hasVoted || !userId) {
      return;
    }

    const selectedCandidate = pollData.options[index].text;
    setPollData(prevState => ({
      ...prevState,
      hasVoted: true,
      selectedOption: index,
    }));

    try {
      const voteTransaction = database().ref(
        `polling/candidates/${selectedCandidate}/votes`,
      );
      const userVoteRef = database().ref(`polling/users/${userId}`);

      await voteTransaction.transaction(votes => {
        if (votes === null) {
          return 1;
        } else {
          return votes + 1;
        }
      });

      // Setelah transaksi berhasil, simpan vote user
      await userVoteRef.set({
        selectedCandidate: selectedCandidate,
      });

      // Update totalVotes
      setPollData(prevState => ({
        ...prevState,
        totalVotes: prevState.totalVotes + 1,
      }));
      await handleRefresh();
    } catch (error) {
      console.error('Error during vote transaction:', error);
      setPollData(prevState => ({
        ...prevState,
        hasVoted: false,
        selectedOption: null,
      }));
    }
  };
  const handleChangeVote = () => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    Alert.alert(
      'Ganti Pilihan',
      'Apakah Anda yakin ingin mengganti pilihan? Ini akan menghapus hasil polling Anda.',
      [
        {text: 'Batal', onPress: () => setIsProcessing(false), style: 'cancel'},
        {
          text: 'Ya',
          onPress: async () => {
            const newOptions = [...pollData.options];
            const prevSelectedOption = pollData.selectedOption;

            if (prevSelectedOption !== null) {
              const previousVotes = newOptions[prevSelectedOption].votes;

              if (previousVotes > 0) {
                newOptions[prevSelectedOption].votes -= 1;

                const previousCandidate = newOptions[prevSelectedOption].text;

                await database()
                  .ref(`polling/candidates/${previousCandidate}/votes`)
                  .set(newOptions[prevSelectedOption].votes);

                await database().ref(`polling/users/${userId}`).remove();
              }
            }

            setPollData(prevData => {
              const updatedVotes = prevData.totalVotes - 1; // Mengurangi totalVotes hanya sekali

              return {
                ...prevData,
                options: newOptions,
                hasVoted: false,
                selectedOption: null,
                totalVotes: updatedVotes,
              };
            });
            await AsyncStorage.removeItem(POLL_STORAGE_KEY);

            setIsProcessing(false);
          },
        },
      ],
      {cancelable: false},
    );
  };
  const calculatePercentage = votes => {
    if (pollData.totalVotes === 0) {
      return 0;
    }
    const percentage = (votes / pollData.totalVotes) * 100;
    return Math.min(percentage, 100);
  };

  const handleRefresh = async () => {
    try {
      const snapshot = await database().ref('polling/candidates').once('value');
      const candidates = snapshot.val();

      let options = await Promise.all(
        Object.keys(candidates).map(async candidate => {
          const imageName =
            candidates[candidate].imageName || `${candidate}.png`;
          const imageUrl = await fetchImageURL(imageName);

          return {
            text: candidate,
            votes: candidates[candidate].votes,
            image: imageUrl,
          };
        }),
      );

      options = options.sort((a, b) => {
        if (a.text === 'Lainnya') {
          return 1;
        }
        if (b.text === 'Lainnya') {
          return -1;
        }
        return 0;
      });

      const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

      setPollData(prevState => ({
        ...prevState,
        options,
        totalVotes,
      }));
    } catch (error) {
      console.error('Error refreshing candidates:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Gap height={8} />
      <Text style={styles.title}>{pollData.title}</Text>
      <Gap height={16} />
      {pollData.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleVote(index)}
          disabled={pollData.hasVoted}
          style={[
            styles.optionContainer,
            pollData.selectedOption === index && pollData.hasVoted
              ? styles.selectedOptionContainer
              : null,
          ]}>
          <View style={styles.optionContent}>
            <View style={styles.imageWrapper}>
              <Image
                source={{uri: option.image}}
                style={styles.candidateImage}
              />
            </View>
            <Text style={styles.optionText}>{option.text}</Text>
            {pollData.hasVoted && (
              <Text style={styles.percentageText}>
                {`${calculatePercentage(option.votes).toFixed(0.1)}%`}
              </Text>
            )}
          </View>
          {pollData.hasVoted && (
            <View
              style={[
                styles.resultBar,
                {width: `${calculatePercentage(option.votes)}%`},
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
      {pollData.hasVoted && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleChangeVote}
            style={styles.changeButton}>
            <IcGanti />
            <Text style={styles.changeButtonText}>Ganti Pilihan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshbutton}
            onPress={handleRefresh}>
            <Icrefreshpoll />
          </TouchableOpacity>
        </View>
      )}

      <Gap height={8} />
    </View>
  );
};

export default CardPoling;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderColor: '#ffff',
    borderWidth: 2,
    backgroundColor: '#003CB0',
    shadowColor: '#003CB0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 27,
    paddingVertical: 8,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#ffff',
    fontFamily: theme.fonts.inter.semiBold,
  },
  optionContainer: {
    marginVertical: 4,
    backgroundColor: '#c1ddf7',
    borderRadius: 10,
    overflow: 'hidden',
    height: 60,
  },
  selectedOptionContainer: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  optionContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    height: '115%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    // paddingHorizontal: '5%',
  },
  refreshbutton: {
    paddingHorizontal: '5%',
    paddingTop: '8%',
  },
  imageWrapper: {
    position: 'absolute',
    left: 10,
  },
  candidateImage: {
    width: 90,
    height: 100,
  },
  optionText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: '55%',
    flex: 1,
    fontFamily: theme.fonts.inter.semiBold,
  },
  resultBar: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
    backgroundColor: 'rgba(0, 61, 176, 0.5)',
    zIndex: 1,
    borderRadius: 8,
    borderColor: '#fff',
    borderWidth: 1,
  },
  percentageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: theme.fonts.inter.semiBold,
  },
  changeButton: {
    marginTop: 15,
    backgroundColor: '#92CBFF',
    paddingVertical: '2%',
    paddingHorizontal: '22%',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  changeButtonText: {
    paddingHorizontal: '5%',
    color: '#344ab9',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
  },
});
