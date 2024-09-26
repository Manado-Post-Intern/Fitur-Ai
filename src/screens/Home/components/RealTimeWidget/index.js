import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';
import {IcGreenIndicator, IcRedIndicator, IMGCengkeh} from '../../../../assets';

const RealTimeWidget = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [oldPrice, setOldPrice] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const priceRef = database().ref('realTimePrice/cengkeh');

    const onValueChange = priceRef.on('value', snapshot => {
      const data = snapshot.val();
      setCurrentPrice(data?.currentPrice);
      setOldPrice(data?.oldPrice);
      setDate(data?.date);
    });

    return () => priceRef.off('value', onValueChange);
  }, []);

  const formatPrice = price => {
    if (!price) {
      return '';
    }
    if (price >= 100000 && price % 1000 === 0) {
      return `${(price / 1000).toLocaleString('id-ID')}rb`;
    }
    return price.toLocaleString('id-ID');
  };

  const formattedPrice = formatPrice(currentPrice);

  const renderIndicator = () => {
    if (currentPrice > oldPrice) {
      return <IcGreenIndicator style={styles.icon} />;
    } else if (currentPrice < oldPrice) {
      return <IcRedIndicator style={styles.icon} />;
    }
    return null;
  };

  return (
    <View>
      <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.titleContainer}>Update Harga</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Cengkeh</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Rp {formattedPrice}</Text>
              {renderIndicator()}
            </View>
            <View>
              <Text style={styles.dateContainer}>{date}</Text>
            </View>
          </View>
        </View>
        <Image source={IMGCengkeh} style={styles.image} />
      </View>
    </View>
  );
};

export default RealTimeWidget;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    borderColor: '#C1D8DD',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: '5%',
    paddingVertical: '2%',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  titleContainer: {
    fontSize: 25,
    color: '#054783',
    fontWeight: '600',
    marginBottom: '1%',
  },
  subtitleContainer: {
    borderRadius: 9,
    borderColor: 'rgba(206, 206, 206, 1)',
    borderWidth: 1,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    backgroundColor: 'rgba(194, 194, 194, 0.5)',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(98, 98, 98, 1)',
    fontWeight: '600',
  },
  price: {
    fontSize: 40,
    fontWeight: '800',
    color: '#373737',
    // paddingRight: '30%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: '3%',
  },
  image: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: 'contain',
    position: 'absolute',
    left: '61%',
    bottom: '-28%',
  },
  dateContainer: {
    marginTop: 8,
    fontSize: 14,
    backgroundColor: 'rgba(86, 164, 235, 1)',
    alignSelf: 'flex-start',
    color: '#FFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
});
