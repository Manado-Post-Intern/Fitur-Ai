/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useEffect} from 'react';
import {TokenContext} from '../../../../context/TokenContext';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {Gap, TextInter} from '../../../../components';
import {IcPlus, theme} from '../../../../assets';
import More from '../../../../components/atoms/More';
import {Card} from './components';
import Tts from 'react-native-tts';
import axios from 'axios';
import {readArticle} from '../../../../api';
import {useSnackbar} from '../../../../context/SnackbarContext';

const NewsForYou = ({
  data,
  canalModalRef,
  item,
  preferences,
  onShowSnackbar,
}) => {
  const [activeTTS, setActiveTTS] = useState(null);
  const [article, setArticle] = useState(null);
  const {token} = useContext(TokenContext);
  const {showSnackbar, hideSnackbar, toggleSnackbar} = useSnackbar(); // Gunakan fungsi dari SnackbarContext
  const getArticle = async () => {
    if (!item?.id) {
      console.log('Item ID is undefined or null');
      return;
    }
    try {
      const response = await axios.get(readArticle, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
        params: {id: item.id},
      });
      setArticle(response.data.data.detail);
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside 2xx range
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.log('Error request:', error.request);
      } else {
        // Something happened in setting up the request
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
    }
  };
  useEffect(() => {
    if (token) {
      getArticle();
    }
  }, [token]);

  const handleTTSPress = id => {
    // let message = '';

    if (activeTTS !== null && activeTTS !== id) {
      // Tts.stop();
      setActiveTTS(id);
      // message = 'Pemutaran dijeda';
      // onShowSnackbar(true, message);
    }

    if (activeTTS === id) {
      setActiveTTS(id);
      // message = 'Pemutaran dijeda';
      // onShowSnackbar(true, message);
      // Tts.stop();
    } else {
      setActiveTTS(id);
      // message = 'Mendengarkan...';
      // onShowSnackbar(true, message);
      // console.log(article?.content);
      // Tts.speak('kedepan harus tetap sama');
    }
  };

  const handleSendTitle = (title, id) => {
    // setSelectedTitle(title); // Update title yang dipilih
    // titleRef.current = title; // Update nilai di useRef
    if (activeTTS === id) {
      showSnackbar(`${title}`, 'black'); // Tampilkan Snackbar dengan pesan
      console.log(title);
    } else {
      showSnackbar(`${title}`, 'black'); // Tampilkan Snackbar dengan pesan
      console.log(title);
    }
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <TextInter style={styles.title}>Berita Untukmu</TextInter>
      </View>
      <Gap height={8} />
      <View style={styles.categoriesWrapper}>
        <View style={styles.categoriesContainer}>
          <FlatList
            data={preferences}
            horizontal
            renderItem={({item, index}) => (
              <TextInter style={styles.categories} key={index}>
                {item.name}
              </TextInter>
            )}
          />
          <Pressable
            style={{padding: 5}}
            onPress={() => {
              canalModalRef.current?.present();
            }}>
            <IcPlus />
          </Pressable>
        </View>
      </View>
      <Gap height={4} />
      {item?.slice(0, 5).map((item, i) => {
        const isDisabled = activeTTS !== null && activeTTS !== item.id;
        return (
          <Card
            key={i}
            item={item}
            isActive={activeTTS === item.id}
            onPress={() => handleTTSPress(item.id)}
            onSendTitle={handleSendTitle} // Kirim handleSendTitle ke Card
          />
        );
      })}
      <More forYou item={item} />
    </View>
  );
};

export default NewsForYou;

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: theme.colors.MPGrey2,
    fontWeight: '700',
    marginLeft: 16,
  },
  categoriesWrapper: {
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    marginHorizontal: 8,
    marginVertical: 5,
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 10,
    color: theme.colors.grey1,
  },
});
