/* eslint-disable prettier/prettier */
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {theme} from '../../assets';
import {
  AiChatButton,
  Banner1,
  Banner2,
  Gap,
  SnackbarNotification,
} from '../../components';
import {
  ActionSection,
  BottomBanner,
  CardPoling,
  FullBanner,
  Headlines,
  LatestNews,
  NewsForYou,
  SecondBanner,
  Story,
  TopBanner,
  RealTimeWidget,
} from './components';
import {screenHeightPercentage} from '../../utils';
import CanalModal from './components/NewsForYou/components/CanalModal';
import axios from 'axios';
import {headline, latestEndPoint} from '../../api';
import {regionList} from '../../data';
import {AdsContext} from '../../context/AdsContext';
import {TokenContext} from '../../context/TokenContext';
import {checkUserPreferences} from '../../utils/checkUserPreferences';
import {AuthContext} from '../../context/AuthContext';
import moment from 'moment';
import database from '@react-native-firebase/database';
import {useSnackbar} from '../../context/SnackbarContext';
import { useNavigationState } from '@react-navigation/native';

const data = [0, 1, 2];
const daerah = ['Manado', 'Minahasa Utara', 'Bitung', 'Tondano'];

const Home = ({navigation}) => {
  const {token} = useContext(TokenContext);
  const {mpUser} = useContext(AuthContext);
  const canalModalRef = useRef();
  const [headlines, setHeadlines] = useState(null);
  const [forYou, setForYou] = useState(null);
  // const [trending, setTrending] = useState(null);
  const [latest, setLatest] = useState(null);
  const [story, setStory] = useState(null);
  const {top, bottom, second, full} = useContext(AdsContext);
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [isRealTime, setisRealTime] = useState(false);

  const fetchPollingStatus = async () => {
    try {
      const snapshot = await database()
        .ref('polling/isPollingActive')
        .once('value');
      const status = snapshot.val();
      setIsPollingActive(status === 1);
    } catch (error) {
      console.log('Error fetching polling status:', error);
    }
  };
  useEffect(() => {
    fetchPollingStatus();
    const onPollingStatusChange = database()
      .ref('polling/isPollingActive')
      .on('value', snapshot => {
        const status = snapshot.val();
        setIsPollingActive(status === 1);
      });

    return () =>
      database()
        .ref('polling/isPollingActive')
        .off('value', onPollingStatusChange);
  }, []);

  const fetchRealtimeHarga = async () => {
    try {
      const snapshot = await database()
        .ref('realTimePrice/isRealTimeActive')
        .once('value');
      const status = snapshot.val();
      setisRealTime(status === 1);
    } catch (error) {
      console.log('Error fetching polling status:', error);
    }
  };
  useEffect(() => {
    fetchRealtimeHarga();
    const onfetchRealtimeHarga = database()
      .ref('realTimePrice/isRealTimeActive')
      .on('value', snapshot => {
        const status = snapshot.val();
        setisRealTime(status === 1);
      });
    return () =>
      database().ref('/isRealTimeActive').off('value', onfetchRealtimeHarga);
  }, []);
  const {showSnackbar} = useSnackbar();

  const handleSomeAction = () => {
    showSnackbar('Snackbar message!', 'black');
  };

  const getHeadline = async () => {
    try {
      const response = await axios.get(headline, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
      });
      setHeadlines(response.data.data.list);
    } catch (error) {
      console.log(error);
    }
  };
  // const getForYou = async () => {
  //   try {
  //     const response = await axios.get(editorPick, {
  //       headers: {
  //         Accept: 'application/vnd.promedia+json; version=1.0',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setForYou(response.data.data.list);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getLatest = async () => {
    try {
      const response = await axios.get(latestEndPoint, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
      });
      setLatest(response.data.data.list.latest);
    } catch (error) {
      console.log(error);
    }
  };
  // const getTrending = async () => {
  //   try {
  //     const response = await axios.get(popular, {
  //       headers: {
  //         Accept: 'application/vnd.promedia+json; version=1.0',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setTrending(response.data.data.list);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getStory = async () => {
    const promises = regionList.map(async item => {
      const response = await axios.get(latestEndPoint, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
        params: {page: 1, section_id: item.id},
      });
      let data = response.data.data.list.latest[0];
      data.region = item.name;
      data.icon = item.icon_url;
      return data;
    });

    try {
      const result = await Promise.all(promises);
      setStory(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getForYouNews = async preference => {
    const promises = preference.map(async item => {
      const response = await axios.get(latestEndPoint, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
        params: {page: 1, section_id: item.id},
      });
      const data = response.data.data.list.latest;
      return data;
    });

    try {
      const result = await Promise.all(promises);
      const array = result.flat();
      setForYou({preferences: preference, array});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getHeadline();
      // getForYou();
      // getTrending();
      getLatest();
      getStory();
      // getReferenceSite();
    }
  }, [token]);
  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true; 
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); 
  }, [navigation]);

  useEffect(() => {
    if (mpUser && token) {
      checkUserPreferences(mpUser)
        .then(res => {
          const preferences = [];
          if (res.channel && Array.isArray(res.channel)) {
            preferences.push(...res.channel);
          }

          if (res.region && Array.isArray(res.region)) {
            preferences.push(...res.region);
          }

          getForYouNews(preferences);
        })
        .catch(error => {
          if (error.message === 'User preferences not found') {
            // canalModalRef.current.present();
            navigation.navigate('ChooseCanal');
          } else {
            console.log(error);
          }
        });
    }
  }, [mpUser, token]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <ScrollView style={styles.bodyContainer}>
          <Gap height={36} />

          <Story item={story} />

          <Gap height={12} />

          <ActionSection preferences={mpUser?.preferences} />
          <Gap height={12} />
          {top && <TopBanner item={top} />}

          <Gap height={12} />
          {isPollingActive && <CardPoling />}
          <Gap height={12} />
          {isRealTime && <RealTimeWidget />}
          <Gap height={12} />
          <Headlines data={headlines} />
          <Gap height={12} />
          {second && <SecondBanner item={second} />}
          <Gap height={12} />
          <NewsForYou
            canalModalRef={canalModalRef}
            item={forYou?.array.sort((a, b) =>
              moment(b.published_date).diff(moment(a.published_date)),
            )}
            preferences={forYou?.preferences}
            onShowSnackbar={handleSomeAction}
          />

          <Gap height={25} />
          <Banner2 />

          <LatestNews item={latest} />

          <Gap height={12} />

          {/* <TrendingSection item={trending} /> */}
          {bottom && <BottomBanner item={bottom} />}

          <Gap height={12} />

          {full && <FullBanner item={full} />}

          <Banner1 />

          {/* <MPDigital />

          <Gap height={12} />

          {data.map((item, i) => (
            <CardNews key={i} />
          ))}

          <Gap height={12} />

          <MPNewspaper /> */}

          <Gap height={screenHeightPercentage('11%')} />
        </ScrollView>
        <View style={styles.wrapAiChatBtn}>
          <AiChatButton navigation={navigation} />
        </View>
        <CanalModal
          canalModalRef={canalModalRef}
          preferences={forYou?.preferences}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

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

  bodyContainer: {
    top: -20,
  },
  wrapAiChatBtn: {
    position: 'absolute', // Mengatur tombol di posisi tetap
    bottom: 55, // Jarak dari bawah layar
    right: 2, // Jarak dari kanan layar
    alignItems: 'center', // Pusatkan horizontal di dalam View
    justifyContent: 'center', // Pusatkan vertikal di dalam View
    width: 60, // Lebar tombol yang diinginkan
    height: 60, // Tinggi tombol yang diinginkan
  },
});
