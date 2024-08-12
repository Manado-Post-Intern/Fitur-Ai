import {
  FlatList,
  Image,
  Linking,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {IMGDummyDigital} from '../../../../assets';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const HEIGHT = 160;
const WIDTH = 300;
const SPACING = 5;

const SecondBanner = ({item}) => {
  const [index, setIndex] = useState(0);
  const [onDrag, setOnDrag] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!item) return;
    if (!onDrag && item?.length > 0) {
      ref.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });
    }
    const intervalId = setInterval(() => {
      if (index === item?.length - 1) {
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [index, onDrag]);

  return (
    <FlatList
      onScrollBeginDrag={() => {
        setOnDrag(true);
      }}
      onScrollEndDrag={e => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / WIDTH);
        setOnDrag(false);
        setIndex(newIndex);
      }}
      ref={ref}
      data={item}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      horizontal
      renderItem={({item}) => <Banner item={item} />}
    />
  );
};

const Banner = ({item}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        const haveHttp = item?.link?.includes('http');
        if (haveHttp) {
          return Linking.openURL(item?.link);
        }
        return Linking.openURL(`http://${item?.link}`);
      }}>
      <Image source={{uri: item?.imageUri}} style={styles.image} />
    </TouchableOpacity>
  );
};

export default SecondBanner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  image: {
    borderRadius: 10,
    overflow: 'hidden',
    height: HEIGHT,
    width: WIDTH,
    resizeMode: 'cover',
  },
});
