import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Gap, NotFound, TextInter, TopBar} from '../../components';
import {IcBack, theme} from '../../assets';
import {screenHeightPercentage} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import {Card} from './components';
import {loadSession, search} from '../../api';
import axios from 'axios';

const data = [0, 1, 2, 3];

const Search = () => {
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [searchRes, setSearchRes] = useState([]);
  const navigation = useNavigation();

  // const notFound = false;

  // if (notFound) {
  //   return (
  //     <>
  //       <View style={styles.topBarContainer}>
  //         <TopBar />
  //       </View>
  //       <View style={styles.container}>
  //         <NotFound />
  //       </View>
  //     </>
  //   );
  // }

  const getSearchedNews = async () => {
    try {
      const response = await axios.get(search, {
        headers: {
          Accept: 'application/vnd.promedia+json; version=1.0',
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          page: page,
        },
      });
      // console.log(response.data.data.list.latest);
      setSearchRes(response.data.data.list.latest);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && query) {
      getSearchedNews();
    }
  }, [token, query]);

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
    <ScrollView style={styles.container}>
      <TopBar searchOnly={true} onSearchPress={word => setQuery(word)} />

      <>
        <Gap height={14} />
        <View style={styles.informationContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <IcBack />
          </Pressable>

          <Gap height={8} />

          <TextInter style={styles.information}>
            Hasil pencarian berita untuk {query}
          </TextInter>
        </View>
        <Gap height={4} />
        {searchRes?.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  topBarContainer: {
    zIndex: 100,
  },

  container: {
    flex: 1,
    backgroundColor: theme.colors.MPWhite2,
  },
  informationContainer: {
    paddingHorizontal: 12,
    marginHorizontal: 17,
  },
  information: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: '#969696',
  },

  notFoundContainer: {
    alignItems: 'center',
    paddingHorizontal: 44,
    marginTop: 60,
  },
  notFoundIll: {
    width: 270,
    height: 212,
  },
  sorry: {
    fontFamily: theme.fonts.inter.bold,
    fontSize: 24,
    color: '#7D7979',
  },
  notFound: {
    fontSize: 24,
    color: '#7D7979',
    textAlign: 'center',
  },

  actionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: screenHeightPercentage('5%'),
  },
});
