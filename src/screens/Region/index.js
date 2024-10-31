/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import {
  // eslint-disable-next-line no-unused-vars
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AiChatButton, Banner2, Gap, TopBar} from '../../components';
import {screenHeightPercentage} from '../../utils';
import {theme} from '../../assets';
// eslint-disable-next-line no-unused-vars
import {AreaSection, Story} from './components';
import {latestEndPoint, loadSession} from '../../api';
import {regionList} from '../../data';
import axios from 'axios';
import {useSnackbar} from '../../context/SnackbarContext';

// eslint-disable-next-line no-unused-vars
const story = ['Manado', 'Bitung', 'Tomohon', 'Minahasa', 'Minahasa Utara'];

const Region = ({navigation}) => {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);

  const getRegion = async () => {
    const promises = regionList.map(async item => {
      const response = await axios.get(latestEndPoint, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
        params: {page: 1, section_id: item.id},
      });
      let data = response.data.data.list;
      data.region = item.name;
      return data;
    });

    try {
      const result = await Promise.all(promises);
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const [activeTTS, setActiveTTS] = useState(null);
  const {showSnackbar, hideSnackbar} = useSnackbar(); // Gunakan fungsi dari SnackbarContext

  const handleTtsPress = id => {
    if (activeTTS !== null && activeTTS !== id) {
      // setActiveTTS(null);
      setActiveTTS(id);
    }

    if (activeTTS === id) {
      // setActiveTTS(null);
      setActiveTTS(id);
    } else {
      setActiveTTS(id);
    }
  };

  const handleSendTitle = (title, id) => {
    if (activeTTS === id) {
      showSnackbar(`${title}`, 'black'); // Tampilkan Snackbar dengan pesan
      console.log(title);
    } else {
      showSnackbar(`${title}`, 'black'); // Tampilkan Snackbar dengan pesan
      console.log(title);
    }
  };

  useEffect(() => {
    if (token) {
      getRegion();
    }
  }, [token]);

  useEffect(() => {
    loadSession()
      .then(session => {
        if (session) {
          setToken(session.access_token);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBarContainer}>
        <TopBar type="region" />
      </View>
      <ScrollView style={styles.container}>
        <Gap height={30} />

        {/* <FlatList
          contentContainerStyle={styles.storyList}
          horizontal
          data={story}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => <Story key={index} />}
        /> */}

        <Gap height={35} />

        <Banner2 />

        <Gap height={18} />

        {/* <AreaSection /> */}
        {data?.map((item, index) => (
          <AreaSection
            key={index}
            item={item}
            activeTTS={activeTTS}
            handleTtsPress={handleTtsPress}
            handleSendTitle={handleSendTitle}
            // id={item.id}
          />
        ))}

        <Gap height={screenHeightPercentage('11%')} />
      </ScrollView>
      <View style={styles.wrapAiChatBtn}>
        <AiChatButton navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default Region;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topBarContainer: {
    zIndex: 100,
  },
  container: {
    zIndex: 0,
    flex: 1,
    backgroundColor: theme.colors.white2,
    top: -20,
  },
  storyList: {
    paddingLeft: 17,
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
