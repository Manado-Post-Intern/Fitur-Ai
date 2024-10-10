import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {
  IcEdit,
  IcGoldCheckmark,
  theme,
  IMGSubscription1Month,
  IMGSubscription6Month,
  IMGSubscription1Year,
} from '../../assets';
import {ChevroletBackButton, Gap, TextInter} from '../../components';
import {screenHeightPercentage} from '../../utils';
import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  endConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
} from 'react-native-iap';
import {AuthContext} from '../../context/AuthContext';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Lottery from '../Home/components/Lottery';

const items = Platform.select({
  ios: [],
  android: ['paket_1_bulanan', 'paket_2_enam_bulan', 'paket_3_tahunan'],
});

const productBaner = [
  IMGSubscription1Month,
  IMGSubscription6Month,
  IMGSubscription1Year,
];
const formatBillingCycle = billingCycle => {
  const period = billingCycle.replace('P', '');

  const value = period.slice(0, -1);
  const unit = period.slice(-1);

  switch (unit) {
    case 'M':
      return `${value} Month`;
    case 'Y':
      return `${value} Year`;
    default:
      return billingCycle;
  }
};
const Subscription = ({price}) => {
  const [products, setProducts] = useState([]);
  const [winner, setWinner] = useState(null);
  const {mpUser} = useContext(AuthContext);
  const subscribed = true;
  const shortTimeLeft = true;
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const fetchCurrencySymbol = async () => {
      try {
        // Fetch country data based on IP
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        console.log('IP-API Response:', data);
        const countryCode = data.countryCode;

        if (!countryCode) {
          throw new Error('Country code not found');
        }
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`,
        );
        const countryData = await countryResponse.json();

        console.log('Country Data:', countryData);

        if (!countryData || !countryData[0] || !countryData[0].currencies) {
          throw new Error('Currency data not available');
        }

        const currencyCode = Object.keys(countryData[0].currencies)[0];
        const currencySymbol = countryData[0].currencies[currencyCode].symbol;
        setCurrencySymbol(currencySymbol);
      } catch (error) {
        console.error('Error fetching currency symbol:', error);
        setCurrencySymbol('N/A');
      }
    };
    fetchCurrencySymbol();
  }, []);

  switch (mpUser.subscription?.productId) {
    case 'paket_1_bulanan':
      word = 'Anda berlangganan paket 1 bulan';
      break;
    case 'paket_2_enam_bulan':
      word = 'Anda berlangganan paket 6 bulan';
      break;
    case 'paket_3_tahunan':
      word = 'Anda berlangganan paket 1 tahun';
      break;
    case '1_bulan_percobaan':
      word = 'Anda dalam masa percobaan 1 bulan';
      break;

    default:
      word = 'Berlangganan sekarang';
      break;
  }

  const handleSubscribe = async (sku, offerToken) => {
    try {
      await requestSubscription({
        sku,
        subscriptionOffers: [
          {
            sku,
            offerToken,
          },
        ],
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(() => {
        getSubscriptions({skus: items})
          .then(res => {
            if (res && Array.isArray(res)) {
              setProducts(res);
            } else {
              console.log('No products found or invalid response format');
            }
          })
          .catch(error => {
            console.log('error finding items ', error);
          });

        purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
          console.log('purchaseUpdatedListener', purchase);
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            const subscriptionRef = database().ref(
              `/users/${mpUser.uid}/subscription/`,
            );

            let expireDate;

            switch (purchase.productId) {
              case 'paket_1_bulanan':
                expireDate = moment().add(1, 'month').format();
                break;
              case 'paket_2_enam_bulan':
                expireDate = moment().add(6, 'months').format();
                break;
              case 'paket_3_tahunan':
                expireDate = moment().add(1, 'year').format();
                break;
              default:
                break;
            }

            const payload = {
              productId: purchase.productId,
              orderId: purchase.transactionId,
              purchaseDate: moment(purchase.transactionDate).format(),
              expireDate,
              isExpired: false,
            };

            await subscriptionRef.update(payload);
            ToastAndroid.show('Berhasil berlangganan', ToastAndroid.SHORT);
            await finishTransaction({purchase});
          }
        });

        purchaseErrorSubscription = purchaseErrorListener(error => {
          console.log('purchaseError', error);
        });
      });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      endConnection();
    };
  }, []);

  useEffect(() => {
    const lotteryWinnerRef = database().ref('/lottery/winner/');
    lotteryWinnerRef.on('value', snapshot => {
      const data = snapshot.val();
      if (!data) {
        return;
      }
      setWinner(data);
    });

    return () => {
      lotteryWinnerRef.off();
    };
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <ChevroletBackButton />
        <TextInter style={styles.title}>Subscription</TextInter>
        <View style={styles.hide}>
          <ChevroletBackButton />
        </View>
      </View>

      <View style={styles.bodyContainer}>
        {/* <View style={styles.profileHeaderContainer}>
          <Image style={styles.profileImage} source={{uri: mpUser.photo}} />
          <Gap width={16} />
          <View style={styles.headerTextContainer}>
            <View>
              <TextInter style={styles.name}>{mpUser.fullName}</TextInter>
              <TextInter style={styles.email}>{mpUser.email}</TextInter>
            </View>
            <Gap width={16} />
            <Pressable
              style={styles.editButton}
              onPress={() => navigation.navigate('Profile')}>
              <IcEdit />
            </Pressable>
          </View>
        </View> */}
        {winner && <Lottery item={winner} />}

        <Gap height={8} />

        {/* {shortTimeLeft && (
          <View style={styles.extendContainer}>
            <TextInter
              style={styles.subscribedLeft}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              Langganan akan habis dalam 1 hari lagi.
            </TextInter>
            <Pressable style={styles.extendButton}>
              <TextInter style={styles.extendButtonLabel}>Perpanjang</TextInter>
            </Pressable>
          </View>
        )} */}

        {subscribed && !shortTimeLeft && (
          <View style={styles.subscribedContainer}>
            <TextInter style={styles.subscribedLeft}>
              Langganan akan habis dalam 28 hari lagi.
            </TextInter>
          </View>
        )}

        <TextInter style={styles.text1}>
          {mpUser?.subscription?.isExpired
            ? 'Paket langganan anda telah habis. Silahkan berlangganan kembali'
            : word}{' '}
          <TextInter style={styles.specialText1}>
            Manado Post Digital Premium
          </TextInter>
        </TextInter>
        <Gap height={8} />
        <TextInter style={styles.text1}>
          {
            'Berlangganan bersifat opsional dan menyediakan akses ke fitur-fitur premium seperti e-Quran, lotere bulanan, dan promo khusus. Anda masih dapat mengakses konten gratis tanpa berlangganan.'
          }
        </TextInter>
        <Gap height={8} />

        <View style={styles.benefitWrapper}>
          <View style={styles.benefitContainer}>
            <IcGoldCheckmark />
            <Gap width={8} />
            <TextInter style={styles.benefit}>
              Akses e-koran terupdate setiap hari
            </TextInter>
          </View>
        </View>

        <View style={styles.benefitWrapper}>
          <View style={styles.benefitContainer}>
            <IcGoldCheckmark />
            <Gap width={8} />
            <TextInter style={styles.benefit}>
              Berkesempatan mendapatkan undian yang di undi setiap bulan
            </TextInter>
          </View>
        </View>

        <View style={styles.benefitWrapper}>
          <View style={styles.benefitContainer}>
            <IcGoldCheckmark />
            <Gap width={8} />
            <TextInter style={styles.benefit}>
              Mendapatkan promo khusus
            </TextInter>
          </View>
        </View>
        <TextInter style={styles.benefit}>
          Langganan dapat dibatalkan kapan saja melalui Google Play.
        </TextInter>
        <Gap height={8} />
        <View>
          {products?.length > 0 &&
            products.map((item, index) => {
              if (
                mpUser?.subscription?.productId === item.productId &&
                mpUser?.subscription?.isExpired === false
              ) {
                return null;
              }

              if (
                !item.subscriptionOfferDetails ||
                item.subscriptionOfferDetails.length === 0
              ) {
                return null;
              }

              const offerDetails = item.subscriptionOfferDetails[0];
              const price =
                offerDetails.pricingPhases.pricingPhaseList[0]
                  .priceAmountMicros / 1_000_000;
              const billingCycle =
                offerDetails.pricingPhases.pricingPhaseList[0].billingPeriod;

              return (
                <Pressable
                  key={index}
                  style={styles.subscriptionBannerContainer}
                  onPress={() => {
                    handleSubscribe(item.productId, offerDetails.offerToken);
                  }}>
                  <View style={styles.cardContainer}>
                    <TextInter style={styles.priceTag}>{`${formatBillingCycle(
                      billingCycle,
                    )}`}</TextInter>
                    <TextInter
                      style={
                        styles.priceTag1
                      }>{`Price: ${currencySymbol} ${price} `}</TextInter>
                  </View>
                </Pressable>
              );
            })}

          {/* <Pressable
            style={styles.subscriptionBannerContainer}
            onPress={() => {
              handleSubscribe(
                products[0].productId,
                products[0].subscriptionOfferDetails[0].offerToken,
              );
            }}>
            <Image
              style={styles.subscriptionBanner}
              source={IMGSubscription1Month}
            />
          </Pressable>
          <Pressable
            style={styles.subscriptionBannerContainer}
            onPress={() => {
              handleSubscribe(
                products[1].productId,
                products[1].subscriptionOfferDetails[0].offerToken,
              );
            }}>
            <Image
              style={styles.subscriptionBanner}
              source={IMGSubscription6Month}
            />
          </Pressable>
          <Pressable
            style={styles.subscriptionBannerContainer}
            onPress={() => {
              handleSubscribe(
                products[2].productId,
                products[2].subscriptionOfferDetails[0].offerToken,
              );
            }}>
            <Image
              style={styles.subscriptionBanner}
              source={IMGSubscription1Year}
            />
          </Pressable> */}
        </View>
      </View>
      <Gap height={screenHeightPercentage('5%')} />
      {/* <Pressable style={styles.stopSubscribeButton}>
        <TextInter style={styles.stopSubscribe}>
          Tidak ingin berlangganan lagi ?{' '}
          <TextInter style={styles.stopSubscribeBold}>Unsubscribe</TextInter>
        </TextInter>
        </Pressable> */}
    </ScrollView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: screenHeightPercentage('5%'),
  },

  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: theme.colors.MPGrey2,
  },
  hide: {
    opacity: 0,
  },

  bodyContainer: {
    marginHorizontal: 24,
    flex: 1,
  },
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkBright,
    paddingBottom: 16,
  },
  profileImage: {
    borderRadius: 100,
    width: 75,
    height: 75,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.MPBlue0,
  },
  email: {
    fontSize: 12,
    color: theme.colors.grey1,
  },
  editButton: {
    borderRadius: 8,
    backgroundColor: theme.colors.MPGrey2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },

  extendContainer: {
    backgroundColor: '#FF6767',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    width: '100%',
  },
  extendButton: {
    backgroundColor: theme.colors.MPBlue0,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 27,
    justifyContent: 'center',
  },
  extendButtonLabel: {
    fontSize: 12,
    color: theme.colors.fontLight,
  },

  subscribedContainer: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.grey1,
    marginBottom: 8,
  },
  subscribedLeft: {
    fontSize: 12,
    color: theme.colors.fontLight,
    flex: 1,
  },

  text1: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  specialText1: {
    fontSize: 14,
    color: theme.colors.MPBlue1,
    fontFamily: theme.fonts.inter.semiBold,
  },

  benefitWrapper: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#EFEEEE',
    borderRadius: 4,
    marginBottom: 8,
  },
  benefit: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.grey1,
    flexShrink: 1,
  },

  subscriptionBannerContainer: {
    // height: 100,
    // marginBottom: 16,
    marginVertical: 10,
  },
  subscriptionBanner: {
    width: '100%',
    maxHeight: 150,
    resizeMode: 'cover',
  },
  cardContainer: {
    backgroundColor: '#024D91',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },
  priceTag: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  priceTag1: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  stopSubscribeButton: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  stopSubscribe: {
    fontSize: 14,
    color: theme.colors.grey1,
    textAlign: 'center',
  },
  stopSubscribeBold: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
  },
});
