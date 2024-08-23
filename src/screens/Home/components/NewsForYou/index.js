/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {Gap, TextInter} from '../../../../components';
import {IcPlus, theme} from '../../../../assets';
import More from '../../../../components/atoms/More';
import {Card} from './components';
import Tts from 'react-native-tts';

const NewsForYou = ({
  data,
  canalModalRef,
  item,
  preferences,
  onShowSnackbar,
}) => {
  const [activeTTS, setActiveTTS] = useState(null);

  const handleTTSPress = id => {
    let message = '';

    if (activeTTS !== null && activeTTS !== id) {
      setActiveTTS(null);
      message = 'Pemutaran dijeda';
      onShowSnackbar(true, message);
    }

    if (activeTTS === id) {
      setActiveTTS(null);
      message = 'Pemutaran dijeda';
      onShowSnackbar(true, message);
      Tts.stop();
    } else {
      setActiveTTS(id);
      message = 'Mendengarkan...';
      onShowSnackbar(true, message);
      Tts.speak('hallo nama saya william', {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
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
      {item?.slice(0, 5).map((item, i) => (
        <Card
          key={i}
          item={item}
          isActive={activeTTS === item.id}
          onPress={() => handleTTSPress(item.id)}
        />
      ))}
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
