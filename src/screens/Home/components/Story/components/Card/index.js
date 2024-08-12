import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {IMGMinahasaLogo, IMGStoryDummy, theme} from '../../../../../../assets';
import {TextInter} from '../../../../../../components';
import LinearGradient from 'react-native-linear-gradient';
import {regionList} from '../../../../../../data';

const Card = ({item}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('Article', {articleId: item?.id})}
        style={styles.picture}>
        <Image
          source={{uri: item?.photo_url}}
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
        />
      </Pressable>
      <View style={styles.innerContainer}>
        {item?.icon && (
          <View
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 50,
              shadowColor: '#000',

              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,
              elevation: 11,
            }}>
            <Image
              source={item.icon}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
        <TextInter style={styles.text}>{item?.region}</TextInter>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    height: 195,
    width: 108,
    alignItems: 'center',
  },
  picture: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.white,
    overflow: 'hidden',
  },
  innerContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
  },
  avaContainer: {
    width: 37,
    height: 37,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 5,
  },
  ava: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 11,
    color: theme.colors.storyTextGray,
    textAlign: 'center',
  },
});
