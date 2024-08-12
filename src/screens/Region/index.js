import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Banner2, Gap, TopBar} from '../../components';
import {screenHeightPercentage} from '../../utils';
import {theme} from '../../assets';
import {AreaSection, Story} from './components';
import {latestEndPoint, loadSession} from '../../api';
import {regionList} from '../../data';
import axios from 'axios';

const story = ['Manado', 'Bitung', 'Tomohon', 'Minahasa', 'Minahasa Utara'];

const Region = () => {
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
        {data?.map((item, index) => {
          return <AreaSection key={index} item={item} />;
        })}

        <Gap height={screenHeightPercentage('11%')} />
      </ScrollView>
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
});
