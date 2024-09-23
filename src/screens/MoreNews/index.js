/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {IMGMPTextPrimary, IcBack, IcMagnifying, theme} from '../../assets';
import {SnackbarNotification, TextInter} from '../../components';
import {Card, MediumBanner} from './components';
import {useNavigation} from '@react-navigation/native';
import {regionList, sectionList} from '../../data';
import {latestEndPoint, loadSession, tagArticle} from '../../api';
import axios from 'axios';
import {AdsContext} from '../../context/AdsContext';
import {Snackbar} from 'react-native-paper';
import {useSnackbar} from '../../context/SnackbarContext';

const SPACING = 10;

const MoreNews = ({route}) => {
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(null);
  const [moreNews, setMoreNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {sectionId, tag, latest, forYou, newsForYou} = route.params;
  const {medium} = useContext(AdsContext);
  const label = sectionList.find(item => item?.id === sectionId)?.name;

  const {showSnackbar, hideSnackbar, toggleSnackbar} = useSnackbar();

  const [activeTTS, setActiveTTS] = useState(null);

  const handleTTSPress = (id) => {
    if (activeTTS === id) {
      setActiveTTS(null);
      hideSnackbar();
    } else {
      setActiveTTS(id);
      const selectedItem = moreNews.find(item => item.id === id);
      if (selectedItem) {
        showSnackbar(`${selectedItem.title}`, 'black');
      }
    }
  };
  

  const handleSendTitle = (title, id) => {
    if (activeTTS === id) {
      hideSnackbar();
    } else {
      showSnackbar(`${title}`, 'black');
      console.log(title);
    }
  };


  const navigation = useNavigation();

  const bottomReached = ({layoutMeasurement, contentOffset, contentSize}) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 10
    );
  };

  const getMoreNews = async () => {
    setIsLoading(true);
    try {
      if (sectionId) {
        const response = await axios.get(latestEndPoint, {
          headers: {
            Accept: 'application/vnd.promedia+json; version=1.0',
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            section_id: sectionId,
          },
        });
        setMoreNews(prevData => [
          ...prevData,
          ...response.data.data.list.latest,
        ]);
      } else if (tag) {
        const response = await axios.get(tagArticle, {
          headers: {
            Accept: 'application/vnd.promedia+json; version=1.0',
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            tag,
          },
        });
        setMoreNews(prevData => [
          ...prevData,
          ...response.data.data.list.latest,
        ]);
      } else if (latest) {
        const response = await axios.get(latestEndPoint, {
          headers: {
            Accept: 'application/vnd.promedia+json; version=1.0',
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
          },
        });
        setMoreNews(prevData => [
          ...prevData,
          ...response.data.data.list.latest,
        ]);
      } else if (forYou) {
        setMoreNews(newsForYou);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !isLoading) {
      getMoreNews();
    }
  }, [page, token]);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IcBack />
        </TouchableOpacity>
        <Image
          source={IMGMPTextPrimary}
          style={{
            resizeMode: 'contain',
            width: '35%',
            height: 50,
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <IcMagnifying />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            colors={['#12365D', '#021726']}
          />
        }
        onScroll={({nativeEvent}) => {
          if (bottomReached(nativeEvent)) {
            console.log('reach bottom');
            setPage(prevPage => prevPage + 1);
          }
        }}>
        <MediumBanner item={medium} />
        <View style={styles.labelContainer}>
          <TextInter style={styles.label}>
            {label || tag || (latest && 'Berita Terbaru') || 'Berita Untukmu'}
          </TextInter>
        </View>

        <View>
          {moreNews?.map((item, index) => {
            const isDisabled = activeTTS !== null && activeTTS !== item.id; // Disable if another button is active
            return (
              <Card
                key={index}
                item={item}
                isActive={activeTTS === item.id}
                onPress={() => handleTTSPress(item.id)}
                onSendTitle={handleSendTitle}
                disabled={isDisabled}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreNews;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.white2},
  headerContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {marginTop: SPACING * 2, marginBottom: SPACING},
  label: {
    fontSize: 24,
    fontFamily: 'Roboto',
    color: theme.colors.MPGrey2,
    fontWeight: '700',
    marginLeft: 16,
  },
  snackbar: {
    position: 'static',
    bottom: 60,
    width: 400,
    height: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(0, 0, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSnacbar: {
    color: 'white',
    textAlign: 'center',
  },
});
