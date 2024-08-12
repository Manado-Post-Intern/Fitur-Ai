import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGDummyNews, theme} from '../../../../assets';
import {Gap, TextInter} from '../../../../components';
import {useNavigation} from '@react-navigation/native';

const Card = ({type, item}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('MetaDetail', {item});
  };
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item?.thumbnail}} />
        <TextInter style={styles.label}>{item?.site_name}</TextInter>
      </View>
      <Gap height={3} />
      <Pressable style={[styles.button, type === 'primary' && styles.primary]}>
        <TextInter
          style={[styles.buttonLabel, type === 'primary' && styles.primary]}>
          View
        </TextInter>
      </Pressable>
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    margin: 4,
    borderRadius: 4,
    padding: 4,
    elevation: 5,
    shadowColor: 'rgba(1, 36, 69, 0.3)',
  },
  imageContainer: {
    flex: 6,
    height: 85,
  },
  image: {
    borderRadius: 4,
    height: '100%',
    width: '100%',
  },
  label: {
    position: 'absolute',
    bottom: 0,
    fontSize: 10,
    color: theme.colors.fontLight,
    fontFamily: theme.fonts.inter.semiBold,
    width: '100%',
    textAlign: 'center',
    marginBottom: 3,
  },
  button: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    borderRadius: 3,
  },
  primary: {
    backgroundColor: theme.colors.MPBlue1,
    color: theme.colors.fontLight,
  },
  buttonLabel: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 10,
    color: theme.colors.MPBlue1,
  },
});
