import {
  ActivityIndicator,
  Clipboard,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Gap, TextInter, TopBar} from '../../../../components';
import {
  IcBigCheckmark,
  IcCalendarGrey,
  IcLink,
  theme,
} from '../../../../assets';
import ModalCalendar from '../../../../components/molecules/ModalCalendar';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
import {AuthContext} from '../../../../context/AuthContext';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

const requiredField = [
  {field: 'type', message: 'Gambar iklan belum dipilih'},
  {field: 'imageUri', message: 'Gambar iklan belum dipilih'},
  {field: 'link', message: 'Link belum dimasukan'},
  {field: 'adsConfig', message: 'Gambar iklan belum dipilih'},
  {field: 'duration', message: 'Durasi hari belum dimasukan'},
  {field: 'startDate', message: 'Tanggal mulai belum dipilih'},
];

const Order = ({route}) => {
  const {type, adsConfig} = route.params; // Type used for specify type of order
  const {user, mpUser} = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState({
    type,
    imageUri: '',
    link: '',
    adsConfig,
    duration: '0',
    startDate: moment().format('DD MMMM YYYY'),
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [calendarModal, setCalendarModal] = useState(false);
  const modalRef = useRef();

  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop opacity={0.5} pressBehavior="close" {...props} />
    ),
    [],
  );

  const handleImageSelect = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
      });
      setData({...data, imageUri: res.path});
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequired = () =>
    new Promise((resolve, reject) => {
      const emptyField = requiredField.find(
        item =>
          data[item.field] === '' ||
          data[item.field] === null ||
          data[item.field] === undefined ||
          data[item.field] === '0',
      );
      if (emptyField) {
        reject(emptyField.message);
      }
      resolve(data);
    });

  const handleImageUpload = async (imageUri, uid) => {
    setIsLoading(true);
    const referanceKey = database().ref(`/ads/${uid}/list`).push().key;
    const referance = storage().ref(
      `/images/ads/${uid + '_' + referanceKey}.${imageUri.split('.').pop()}`,
    );
    try {
      await referance.putFile(imageUri);
      const url = await referance.getDownloadURL();
      return url;
    } catch (error) {
      throw error.message;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const referance = database().ref(`/ads/data/${user.uid}/list`);
    const profileRef = database().ref(`/ads/data/${user.uid}/profile`);
    try {
      if (!user) {
        throw new Error('Please login first');
      }
      const passed = await handleRequired();
      const url = await handleImageUpload(passed.imageUri, user.uid);
      const normalizeData = {
        ...passed,
        imageUri: url,
        endDate: moment(passed.startDate, 'DD MMMM YYYY')
          .add(passed.duration, 'days')
          .format('DD MMMM YYYY'),
        isAllowed: false,
      };

      // upload data to firebase
      const snapshot = await referance.once('value');
      const profileSnapshot = await profileRef.once('value');
      if (!profileSnapshot.val()) {
        await profileRef.set({email: mpUser.email, fullName: mpUser.fullName});
      }
      let data = snapshot.val() || [];
      data.push(normalizeData);
      await referance.set(data);
      modalRef.current.expand();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const price = data.adsConfig?.pricePerDay * parseInt(data.duration);
    setData({...data, price});

    // return price;
  }, [data.duration, data.adsConfig?.price]);

  return (
    <View style={styles.container}>
      <View>
        <TopBar type="order" />
      </View>
      <View style={styles.body}>
        <ScrollView>
          <TextInter style={styles.title}>MP Ads - {type}</TextInter>
          <View style={[styles.browseContainer, {height: adsConfig?.height}]}>
            {!data.imageUri ? (
              <>
                <Pressable
                  style={styles.browseButton}
                  onPress={handleImageSelect}>
                  <TextInter style={styles.browseLabel}>
                    browse picture
                  </TextInter>
                </Pressable>
                <TextInter style={styles.browseNote}>
                  picture Height = {data.adsConfig?.height.toString()} Px
                </TextInter>
              </>
            ) : (
              <View
                style={{
                  height: adsConfig?.height ? adsConfig.height : 100,
                  width: '100%',
                }}>
                <Image
                  source={{uri: data.imageUri}}
                  style={{flex: 1, resizeMode: 'cover'}}
                />
                <TouchableOpacity
                  onPress={() => setData({...data, imageUri: ''})}
                  style={{
                    backgroundColor: theme.colors.errorRed,
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Text>X</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Gap height={20} />
          <View style={styles.linkInputContainer}>
            <TextInput
              style={styles.linkInput}
              placeholder="Paste direct Link Here"
              placeholderTextColor="#617D9780"
              value={data.link}
              onChangeText={value => setData({...data, link: value})}
            />
            <TouchableOpacity
              onPress={async () => {
                try {
                  const res = await Clipboard.getString();
                  setData({...data, link: res});
                } catch (error) {
                  console.log(error);
                }
              }}>
              <IcLink />
            </TouchableOpacity>
          </View>
          {/* <Gap height={20} /> */}

          {/* <Position onChecked={value => setData({...data, position: value})} /> */}

          <Gap height={16} />

          <View style={styles.row}>
            {/* <Duration
            onDurationSelect={value => setData({...data, duration: value})}
          /> */}
            <View style={styles.highlightDuration}>
              <TextInter style={styles.highlightTop}>Durasi (Hari)</TextInter>
              <Gap height={4} />
              <TextInput
                defaultValue={data.duration}
                style={styles.durationInput}
                keyboardType="numeric"
                value={data.duration}
                onChangeText={value =>
                  setData({
                    ...data,
                    duration: value,
                  })
                }
              />
            </View>
            <Gap width={16} />
            <View style={styles.calendarContainer}>
              <TextInter style={styles.calendarLabel}>Tanggal Mulai</TextInter>
              <Pressable
                style={styles.fieldContainer}
                onPress={() => setCalendarModal(true)}>
                <TextInter style={styles.activeDate}>
                  {data.startDate}
                </TextInter>
                <IcCalendarGrey />
              </Pressable>
            </View>
          </View>
          <Gap height={16} />
        </ScrollView>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.priceContainer}>
          <TextInter style={styles.totalLabel}>total</TextInter>
          <TextInter style={styles.total}>
            {data.price?.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            })}
          </TextInter>
        </View>
        <Pressable style={styles.buyAdsButton} onPress={handleSubmit}>
          <TextInter style={styles.buyAdsLabel}>
            {!isLoading ? (
              'Pasang Iklan'
            ) : (
              <ActivityIndicator animating={true} size={'large'} />
            )}
          </TextInter>
        </Pressable>
      </View>

      <ModalCalendar
        isOpen={calendarModal}
        setIsOpen={setCalendarModal}
        onDayPress={value =>
          setData({
            ...data,
            startDate: moment(value.dateString).format('DD MMMM YYYY'),
          })
        }
      />
      <BottomSheet
        ref={modalRef}
        enablePanDownToClose={true}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheet}>
        <View style={styles.successModalContainer}>
          <TextInter style={styles.successTitle}>
            Iklan Berhasil dipesan
          </TextInter>
          <Gap height={24} />
          <IcBigCheckmark />
          <Gap height={24} />
          <TextInter style={styles.succesInfo}>
            anda akan dihubungi bagian pemasaran Manado Post untuk
            konfirmasi/pembayaran Iklan ini{' '}
          </TextInter>
          <Gap height={24} />
          <Pressable
            style={styles.successButton}
            onPress={() => {
              modalRef.current.close();
              navigation.navigate('Home');
            }}>
            <TextInter style={styles.successButtonLabel}>
              Kembali Ke Halaman Iklan
            </TextInter>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  body: {
    paddingTop: 19,
    paddingHorizontal: 30,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPGrey3,
  },

  browseContainer: {
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#E2E6EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: 100,
  },
  browseButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.grey1,
  },
  browseLabel: {
    color: theme.colors.fontLight,
  },
  browseNote: {
    color: theme.colors.grey1,
    marginTop: 10,
  },

  linkInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DFE8F566',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    paddingRight: 10,
  },
  linkInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
    color: theme.colors.grey1,
  },

  calendarContainer: {
    flex: 1,
  },
  calendarLabel: {
    fontSize: 14,
    color: theme.colors.grey1,
    marginBottom: 4,
  },
  fieldContainer: {
    width: '100%',
    backgroundColor: theme.colors.MPWhite2,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeDate: {
    color: theme.colors.grey1,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerContainer: {
    backgroundColor: theme.colors.darkBright,
    paddingTop: 11,
    paddingHorizontal: 25,
    paddingBottom: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.MPGrey3,
  },
  total: {
    fontSize: 20,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPBlue1,
  },
  buyAdsButton: {
    paddingVertical: 13,
    backgroundColor: theme.colors.MPBlue2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyAdsLabel: {
    fontSize: 17,
    color: theme.colors.MPWhite,
    fontFamily: theme.fonts.inter.semiBold,
    paddingHorizontal: '10%',
  },

  successModalContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successTitle: {
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPGrey3,
    fontSize: 24,
  },
  succesInfo: {
    fontSize: 16,
    color: theme.colors.MPGrey3,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: theme.colors.MPBlue2,
    borderRadius: 16,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  successButtonLabel: {
    color: theme.colors.fontLight,
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
  },
  highlightDuration: {height: '100%'},
  highlightTop: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  durationInput: {
    height: 40,
    // width: 49,
    backgroundColor: theme.colors.MPWhite2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite,
    padding: 0,
    textAlign: 'center',
    color: theme.colors.grey1,
  },
});
