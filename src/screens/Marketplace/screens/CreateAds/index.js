import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
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
import {IcBigCheckmark, IcCalendarGrey, theme} from '../../../../assets';
import {CheckBox, Gap, Switch, TextInter, TopBar} from '../../../../components';
import {Input} from '../../components';
import Dropdown from '../../components/Dropdown';
import {screenHeightPercentage} from '../../../../utils';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import ModalCalendar from '../../../../components/molecules/ModalCalendar';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import {AuthContext} from '../../../../context/AuthContext';
import database from '@react-native-firebase/database';

const labelData = ['Otomotif', 'Properti', 'Lowongan', 'Ragam'];
// const merkData = [
//   'BMW',
//   'Bajaj',
//   'Chevrolet',
//   'Daihatsu',
//   'Honda',
//   'Daihatsu',
//   'Isuzu',
//   'Jeep',
//   'Kawasaki',
//   'Kaisar',
//   'Lexus',
// ];
const statusData = [
  'Dikontrakkan',
  'Dijual Cepat',
  'Dijual',
  'Disewakan',
  'Dicari / Hilang',
  'Menerima',
  'Ditemukan',
];

const requiredField = [
  {field: 'adsImage', message: 'Gambar iklan belum dipilih'},
  {field: 'adsName', message: 'Nama iklan belum diisi'},
  {field: 'price', message: 'Harga iklan belum diisi'},
  {field: 'whatsappContact', message: 'Kontak whatsapp belum diisi'},
  {field: 'label', message: 'Label belum dipilih'},
  {field: 'brand', message: 'Merk belum diisi'},
  {field: 'status', message: 'Status belum dipilih'},
  {field: 'startDate', message: 'Tanggal mulai belum dipilih'},
];

const CreateAds = ({navigation}) => {
  const [data, setData] = useState({
    adsImage: '',
    adsName: '',
    description: '',
    price: '',
    whatsappContact: '',
    address: '',
    label: '',
    brand: '',
    status: '',
    highlight: {
      isHighlight: true,
      duration: '0',
      highlightPrice: '0',
    },
    startDate: '',
    endDate: '',
    totalPrice: 0,
  });
  const [label, setLabel] = useState(0);
  const [pricePerDay, setPricePerDay] = useState(null);
  const [highlightPricePerDay, setHighlightPricePerDay] = useState(null);
  const [isStartToday, setIsStartToday] = useState(false);
  const [status, setStatus] = useState(0);
  const [calendarModal, setCalendarModal] = useState(false);
  const [calendarModalForEndDate, setCalendarModalForEndDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const modalRef = useRef();
  const {user, mpUser} = useContext(AuthContext);

  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop opacity={0.5} pressBehavior="close" {...props} />
    ),
    [],
  );

  const handleTotalPrice = () => {
    const tp =
      parseInt(data.highlight.duration, 10) * highlightPricePerDay +
      pricePerDay * (moment(data.endDate).diff(data.startDate, 'days') + 1);
    setData({...data, totalPrice: tp});
  };

  const handleImageSelect = async () => {
    console.log('select image');
    try {
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
      });
      if (res.size > 512000) {
        ToastAndroid.show('Ukuran gambar terlalu besar', ToastAndroid.SHORT);
        return;
      }
      setData({...data, adsImage: res.path});
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequired = () =>
    new Promise((resolve, reject) => {
      const emptyField = requiredField.find(item => data[item.field] === '');
      if (emptyField) {
        reject(emptyField.message);
      }
      resolve(data);
    });

  const handleImageUpload = async (adsImage, adsName) => {
    const random = Math.floor(Math.random() * 1000);
    const referance = storage().ref(
      `/images/marketplace/${adsName + '_' + random}.${adsImage
        .split('.')
        .pop()}`,
    );
    try {
      await referance.putFile(adsImage);
      const url = await referance.getDownloadURL();
      return url;
    } catch (error) {
      throw error.message;
    }
  };

  const handleNormalizeData = (imageUri, passed) => {
    const normalize = {
      ...passed,
      adsImage: imageUri,
      highlight: {
        isHighlight: passed.highlight.isHighlight,
        duration: passed.highlight.duration,
        perDayPrice: 20000,
        highlightPrice: parseInt(passed.highlight.duration, 10) * 20000,
        endDate: moment(passed.startDate)
          .add(passed.highlight.duration, 'days')
          .format('YYYY-MM-DD'),
      },
      isAllowed: false,
      profile: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      },
    };
    return normalize;
  };

  const handleSubmit = async () => {
    const referance = database().ref(`/marketplace/data/${user.uid}/list`);
    const profileRef = database().ref(`/marketplace/data/${user.uid}/profile`);
    setIsLoading(true);
    try {
      const passed = await handleRequired();
      const imageUri = await handleImageUpload(passed.adsImage, passed.adsName);
      const normalize = handleNormalizeData(imageUri, passed);
      const snapshot = await referance.once('value');
      const profileSnapshot = await profileRef.once('value');
      let data = snapshot.val() || [];
      if (!profileSnapshot.val()) {
        await profileRef.set({email: mpUser.email, fullName: mpUser.fullName});
      }
      data.push(normalize);
      await referance.set(data);

      modalRef.current.expand();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((pricePerDay, data.highlight.duration, data.highlight.highlightPrice)) {
      handleTotalPrice();
    }
  }, [data.highlight.duration, pricePerDay, data.startDate, data.endDate]);

  useEffect(() => {
    if (isStartToday) {
      setData({
        ...data,
        startDate: moment().format('YYYY-MM-DD'),
      });
    }
  }, [isStartToday]);

  useEffect(() => {
    if (!data.highlight.isHighlight) {
      setData({
        ...data,
        highlight: {
          ...data.highlight,
          duration: '0',
        },
      });
    }
  }, [data.highlight.isHighlight]);

  useEffect(() => {
    database()
      .ref('/marketplace/options')
      .once('value', snapshot => {
        const data = snapshot.val();
        setPricePerDay(data.pricePerDay);
        setHighlightPricePerDay(data.highlightPricePerDay);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="order" />
      </View>
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={styles.innerContentContainer}>
        <Gap height={19} />
        <View style={styles.voucherContainer}>
          <TextInter
            style={styles.voucherText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}>
            Menggunakan gratis pasang iklan
          </TextInter>
          <View style={styles.voucherRightContainer}>
            <View style={styles.switchContainer}>
              <Switch />
            </View>
            <TextInter
              style={styles.voucherLeft}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              sisa : 2
            </TextInter>
          </View>
        </View>
        <Gap height={16} />
        <TextInter style={styles.title}>Pasang Iklan</TextInter>
        <Gap height={16} />
        <View style={styles.browseContainer}>
          {!data.adsImage ? (
            <Pressable style={styles.browseButton} onPress={handleImageSelect}>
              <TextInter style={styles.browseLabel}>browse picture</TextInter>
            </Pressable>
          ) : (
            <>
              <Image
                source={{
                  uri: data.adsImage,
                }}
                style={{
                  resizeMode: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setData({...data, adsImage: ''})}
                style={{
                  backgroundColor: theme.colors.errorRed,
                  position: 'absolute',
                  top: 13,
                  right: 13,
                  paddingHorizontal: 13,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    fontFamily: theme.fonts.inter.semiBold,
                  }}>
                  X
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <TextInter style={{}}>*Batas ukuran gambar 500kb</TextInter>
        <Gap height={20} />
        <Input
          placeholder="Nama Barang / Properti / Perkerjaan"
          onChangeText={text => setData({...data, adsName: text})}
          value={data.adsName}
        />
        <Gap height={16} />
        <Input
          placeholder="Deskripsi (bisa tidak diisi)"
          isDescription={true}
          onChangeText={text => setData({...data, description: text})}
          value={data.description}
        />
        <Gap height={16} />
        <Input
          placeholder="Harga Dalam Rupiah (cth: 50000)"
          keyboardType="numeric"
          onChangeText={text => setData({...data, price: text})}
          value={data.price}
        />
        <Gap height={16} />
        <Input
          placeholder="Nomor Kontak Whatsapp"
          onChangeText={text => setData({...data, whatsappContact: text})}
          value={data.whatsappContact}
          keyboardType="numeric"
        />
        <Gap height={16} />
        <Input
          placeholder="Alamat (bisa tidak diisi)"
          onChangeText={text => setData({...data, address: text})}
          value={data.address}
        />
        <Gap height={16} />
        <View style={styles.labelAndMerkContainer}>
          <Dropdown
            data={labelData}
            width="40%"
            label="Label"
            activeItem={label}
            setItem={index => {
              setLabel(index);
              setData({...data, label: labelData[index]});
            }}
          />
          <Gap width={32} />
          <View style={{flex: 1}}>
            <Input
              placeholder="Merk"
              onChangeText={text => setData({...data, brand: text})}
              value={data.brand}
              style={{width: '100%', color: theme.colors.grey1}}
            />
          </View>
        </View>
        <Gap height={16} />
        <Dropdown
          data={statusData}
          //   width="30%"
          label="Status"
          activeItem={status}
          setItem={index => {
            setStatus(index);
            setData({...data, status: statusData[index]});
          }}
        />
        <Gap height={16} />
        <View style={styles.highlightOptionContainer}>
          <View style={styles.highlightSwitchContainer}>
            <View style={styles.switchContainer}>
              <TextInter style={styles.highlightTop}>
                Pasang Higlight Ads
              </TextInter>
              <TextInter style={styles.highlightBottom}>
                Tambah Rp {highlightPricePerDay} / Hari
              </TextInter>
            </View>
            <Gap width={16} />

            <Switch
              defaultValue={false}
              onChange={value =>
                setData({
                  ...data,

                  highlight: {
                    ...data.highlight,
                    isHighlight: value,
                    duration: '1',
                  },
                })
              }
            />
          </View>
          <View style={styles.highlightDuration}>
            <TextInter style={styles.highlightTop}>Durasi (Hari)</TextInter>
            <Gap height={4} />
            <TextInput
              style={styles.durationInput}
              keyboardType="numeric"
              value={data.highlight.duration}
              editable={data.highlight.isHighlight}
              onChangeText={value =>
                setData({
                  ...data,
                  highlight: {...data.highlight, duration: value},
                })
              }
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateContainerComponent}>
            <View style={styles.dateLeftContainer}>
              <TextInter style={styles.dateTitle}>
                Jadwalkan tanggal mulai
              </TextInter>
              <Gap height={4} />
              <Pressable
                disabled={isStartToday}
                style={styles.fieldContainer}
                onPress={() => setCalendarModal(true)}>
                <TextInter style={styles.activeDate}>
                  {data.startDate}
                </TextInter>
                <IcCalendarGrey />
              </Pressable>
            </View>
            <View style={styles.dateRightContainer}>
              <View>
                <TextInter style={styles.dateTitle}>
                  Mulai saat ini juga
                </TextInter>
                <Gap height={4} />
                <Switch
                  onChange={value => setIsStartToday(value)}
                  defaultValue={false}
                />
              </View>
            </View>
          </View>
          <View
            style={[styles.dateLeftContainer, {marginTop: 8, width: '50%'}]}>
            <TextInter style={styles.dateTitle}>
              Jadwalkan tanggal selesai
            </TextInter>
            <Gap height={4} />
            <Pressable
              style={styles.fieldContainer}
              onPress={() => setCalendarModalForEndDate(true)}>
              <TextInter style={styles.activeDate}>{data.endDate}</TextInter>
              <IcCalendarGrey />
            </Pressable>
          </View>
        </View>
        <Gap height={16} />
        <Pressable
          style={styles.termsContainer}
          onPress={() => setTerms(!terms)}>
          <TextInter style={styles.terms}>
            Setujui{' '}
            <TextInter style={styles.bold}>syarat dan ketentuan</TextInter>{' '}
            beriklan
          </TextInter>
          <Gap width={8} />
          <CheckBox isChecked={terms} />
        </Pressable>

        <Gap height={screenHeightPercentage('5%')} />
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.footerLeftContainer}>
          <TextInter style={styles.footerTotal}>total</TextInter>
          <TextInter style={styles.price}>
            {data.totalPrice.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </TextInter>
        </View>
        <Pressable
          style={styles.footerButton}
          onPress={handleSubmit}
          disabled={isLoading}>
          <TextInter style={styles.footerButtonLabel}>
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
        onDayPress={day => setData({...data, startDate: day.dateString})}
      />
      <ModalCalendar
        isOpen={calendarModalForEndDate}
        setIsOpen={setCalendarModalForEndDate}
        onDayPress={day => setData({...data, endDate: day.dateString})}
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
            Iklan Berhasil di Upload
          </TextInter>
          <Gap height={24} />
          <IcBigCheckmark />
          <Gap height={24} />
          <TextInter style={styles.succesInfo}>
            anda akan dihubungi bagian pemasaran Manado Post untuk
            konfirmasi/pembayaran Iklan ini
          </TextInter>
          <Gap height={24} />
          <Pressable
            style={styles.successButton}
            onPress={() => navigation.goBack()}>
            <TextInter style={styles.successButtonLabel}>
              Kembali Ke Halaman Iklan
            </TextInter>
          </Pressable>
        </View>
      </BottomSheet>

      {/* <View
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          top: '50%',
          left: '50%',
          transform: [{translateX: -50}, {translateY: -50}],
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator animating={true} size={'large'} />
      </View> */}
    </View>
  );
};

export default CreateAds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topBarContainer: {
    zIndex: 10,
  },

  innerContainer: {
    flex: 1,
  },
  innerContentContainer: {
    paddingHorizontal: 24,
  },
  voucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite,
  },
  voucherText: {
    fontSize: 13,
    color: theme.colors.grey1,
    flex: 2,
  },
  voucherRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContainer: {},
  voucherLeft: {
    fontSize: 13,
    color: '#F35656',
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
    height: 140,
  },
  browseButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.grey1,
  },
  browseLabel: {
    color: theme.colors.fontLight,
  },

  labelAndMerkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  highlightOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: theme.colors.MPWhite,
    borderTopWidth: 1,
    borderBottomColor: theme.colors.MPWhite,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  highlightSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 7,
  },
  highlightTop: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  highlightBottom: {
    fontSize: 12,
    color: '#617D9780',
  },
  highlightDuration: {
    flex: 3,
  },
  durationInput: {
    height: 25,
    width: 49,
    backgroundColor: theme.colors.MPWhite2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.MPWhite,
    padding: 0,
    textAlign: 'center',
    color: theme.colors.grey1,
  },

  dateContainer: {
    // flexDirection: 'row',
    paddingVertical: 16,
    borderBottomColor: theme.colors.MPWhite,
    borderBottomWidth: 1,
    // marginTop: 8,
  },
  dateContainerComponent: {
    flexDirection: 'row',
  },
  dateTitle: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  dateLeftContainer: {
    flex: 1,
  },
  dateRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  terms: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  bold: {
    fontSize: 14,
    color: theme.colors.grey1,
    fontFamily: theme.fonts.inter.bold,
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

  footerContainer: {
    flexDirection: 'row',
    paddingTop: 11,
    backgroundColor: theme.colors.MPWhite,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeftContainer: {
    flex: 1,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.MPBlue2,
    justifyContent: 'center',
    paddingVertical: 13.5,
    alignItems: 'center',
  },
  footerButtonLabel: {
    fontSize: 17,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPWhite,
  },

  footerTotal: {
    fontSize: 12,
    color: theme.colors.MPGrey3,
    fontFamily: theme.fonts.inter.medium,
  },
  price: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 20,
    color: theme.colors.MPBlue1,
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
});
