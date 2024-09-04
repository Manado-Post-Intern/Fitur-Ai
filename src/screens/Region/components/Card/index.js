import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React,{useContext,useEffect,useState} from 'react';
import {
  Actions,
  CategoryHorizontal,
  Gap,
  TextInter,
  TimeStamp,
} from '../../../../components';
import {IMGDummyNews, theme} from '../../../../assets';
import {useNavigation} from '@react-navigation/native';
import TTSButton from '../../../../components/atoms/TtsButton';
import { TokenContext } from '../../../../context/TokenContext';
import { readArticle } from '../../../../api';

const Card = ({item, isActive, onPress}) => {
  const navigation = useNavigation();
  const [article, setArticle] = useState(null);
  const {token} = useContext(TokenContext);
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
        params: {id: item?.id},
      });
      setArticle(response.data.data.detail);
      console.log('Article Content:', response.data.data.detail.content);
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
      console.log(article?.content);
    }
  }, [token]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Article', {articleId: item?.id})}
      style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item?.photo_url}} />
      </View>
      <Gap width={14} />
      <View style={styles.informationContainer}>
        <TextInter style={styles.title} numberOfLines={4}>
          {item?.title}
        </TextInter>
        <Gap height={8} />
        <View style={styles.TtsButton}>
          <TimeStamp data={item?.published_date} />
          <TTSButton isActive={isActive} onPress={onPress} content={article?.content} />
        </View>
        <Gap height={4} />
        <CategoryHorizontal />
        <Gap height={8} />
        <Actions item={item} />
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 21,
    backgroundColor: theme.colors.white,
    marginVertical: 4,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  informationContainer: {
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.dark1,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categories: {
    marginHorizontal: 8,
    marginVertical: 5,
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 10,
    color: theme.colors.grey1,
  },
  TtsButton: {
    flexDirection: 'row',
  },
});
