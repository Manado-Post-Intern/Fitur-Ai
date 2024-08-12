import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import React, {useRef} from 'react';
import {TextInter, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');

const imageW = width * 0.7;
const imageH = imageW * 1.54;

const MetaMore = ({navigation, route}) => {
  const {filtered} = route.params;
  const scrollX = useRef(new Animated.Value(0)).current;

  const handlePress = item => {
    navigation.navigate('MetaDetail', {item});
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.topBarContainer}>
        <TopBar type="meta" />
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          position: 'absolute',
          zIndex: 2,
          top: 60,
          backgroundColor: theme.colors.MPWhite,
          // paddingVertical: 10,
          paddingRight: 10,
          marginLeft: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => navigation.goBack()}>
        <IcBack />
        <TextInter style={styles.headerText}>Meta</TextInter>
      </TouchableOpacity>
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <View style={StyleSheet.absoluteFillObject}>
          {filtered.map((item, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.Image
                source={{uri: item?.thumbnail}}
                key={index}
                style={[StyleSheet.absoluteFillObject, {opacity}]}
                blurRadius={30}
              />
            );
          })}
        </View>
        <Animated.FlatList
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          data={filtered}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          renderItem={({item}) => {
            return (
              <View
                style={{
                  width,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handlePress(item)}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 16.0,

                    elevation: 24,
                  }}>
                  <Image
                    source={{uri: item?.thumbnail}}
                    style={{
                      width: imageW,
                      height: imageH,
                      resizeMode: 'cover',
                      borderRadius: 16,
                    }}
                  />
                  <LinearGradient
                    colors={['transparent', 'black']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1.2}}
                    locations={[0, 1]}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      borderRadius: 16,
                      height: '40%',
                      width: imageW,
                      paddingHorizontal: 10,
                    }}>
                    <TextInter
                      style={{
                        color: 'white',
                        fontSize: 40,
                        fontFamily: theme.fonts.inter.extraBold,
                      }}
                      numberOfLines={3}>
                      {item?.site_name}
                    </TextInter>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MetaMore;

const styles = StyleSheet.create({
  topBarContainer: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
  },

  headerText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },
});
