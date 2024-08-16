import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Gap, TextInter} from '../../../../components';
import {IcPlus, theme} from '../../../../assets';
import More from '../../../../components/atoms/More';
import {Card} from './components';
import {Snackbar} from 'react-native-paper';

const NewsForYou = ({data, canalModalRef, item, preferences}) => {
  const [activeTTS, setActiveTTS] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleTTSPress = id => {
    if (activeTTS !== null && activeTTS !== id) {
      setActiveTTS(null);
      setShowPopup(false);
    }

    if (activeTTS === id) {
      setActiveTTS(null);
      setShowPopup(false);
    } else {
      setActiveTTS(id);
      setShowPopup(true);
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
      {showPopup && (
        <Snackbar
          visible={showPopup}
          onDismiss={() => setShowPopup(false)}
          style={styles.snackbar}>
          <Text style={styles.textSnacbar}>Mendengarkan...</Text>
        </Snackbar>
      )}
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
  snackbar: {
    position: 'relative',
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
