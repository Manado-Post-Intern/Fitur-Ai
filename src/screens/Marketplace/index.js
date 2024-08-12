import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {IcFilter, IcSearchGray, theme} from '../../assets';
import {Gap, TextInter, TopBar} from '../../components';
import {HorizontalCard, ModalRow, VerticalCard} from './components';
import BottomSheet from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {screenHeightPercentage} from '../../utils';
import database from '@react-native-firebase/database';
import moment from 'moment';

const categories = ['Otomotif', 'Properti', 'Lowongan', 'Ragam'];
const horizontal = [0, 1, 2, 3, 4];
const filterItem = [
  'Paling sesuai',
  'Terbaru',
  'Termahal',
  'Termurah',
  'Label (Otomotif, Properti, dll)',
  'Status (dijual, disewakan, dll)',
];

const Marketplace = () => {
  const referance = database().ref('/marketplace/data');
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [labelledData, setLabelledData] = useState([]);

  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Otomotif');
  const [filter, setFilter] = useState(0);

  const modalRef = useRef();
  const snapPoints = useMemo(() => ['68%'], []);

  const cleaningData = data => {
    const dataArray = [];
    data &&
      Object.values(data).forEach(user => {
        const userList = user['list'];
        dataArray.push(...userList);
      });

    const filtered = dataArray?.filter(item =>
      moment().isBetween(item.startDate, item.endDate),
    );
    return filtered.sort((a, b) => a.startDate - b.endDate);
  };

  const forHighlight = labelledData?.filter(
    item => item.highlight.isHighlight === true,
  );

  useEffect(() => {
    const fetchData = referance.on('value', async snapshot => {
      const data = await snapshot?.val();
      const array = cleaningData(data);
      const isAllowed = array?.filter(item => item.isAllowed === true);
      setData(isAllowed);
    });

    return () => referance.off('value', fetchData);
  }, []);

  useEffect(() => {
    const filteredData = data?.filter(item => item.label === selectedCategory);
    setLabelledData(filteredData);
  }, [selectedCategory, data]);

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="order" />
      </View>
      <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
        <View>
          <FlatList
            data={categories}
            horizontal
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setActiveCategory(index);
                  setSelectedCategory(item);
                }}>
                <TextInter
                  style={[
                    styles.categories,
                    index === activeCategory && styles.activeCategory,
                  ]}>
                  {item}
                </TextInter>
              </Pressable>
            )}
          />
        </View>

        <Gap height={10} />

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari Iklan"
              placeholderTextColor="#C9C9C9"
            />
            <Pressable style={styles.searchButtonContainer}>
              <IcSearchGray />
            </Pressable>
          </View>
          <Gap width={8} />
          {/* <Pressable HIDE DULU NGGAK SIH :v
            style={styles.filterButton}
            onPress={() => modalRef.current?.expand()}>
            <IcFilter />
            <Gap width={10} />
            <TextInter style={styles.filterLabel}>Filter</TextInter>
          </Pressable> */}
        </View>
        <View style={styles.sectionTitleContainer}>
          <TextInter style={styles.sectionTitle}>Highlight</TextInter>
        </View>

        <Gap height={14} />

        <View>
          <FlatList
            data={forHighlight}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListHorizontal}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => <HorizontalCard item={item} />}
          />
        </View>

        <Gap height={14} />

        <View style={styles.sectionTitleContainer}>
          <TextInter style={styles.sectionTitle}>Iklan Baris</TextInter>
        </View>

        <Gap height={4} />

        <View>
          {labelledData?.map((item, i) => (
            <VerticalCard key={i} item={item} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.footerButton}
          onPress={() => navigation.navigate('CreateAds')}>
          <TextInter style={styles.footerLabel}>Pasang Iklan</TextInter>
        </Pressable>
      </View>
      <BottomSheet
        ref={modalRef}
        index={-1}
        snapPoints={snapPoints}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
        enablePanDownToClose={true}>
        <View style={styles.modalContainer}>
          <TextInter style={styles.modalTitle}>Filter</TextInter>
          <Gap height={24} />
          <TextInter style={styles.modalSort}>Urutkan</TextInter>
          <Gap height={22} />
          {filterItem.map((item, i) => (
            <Pressable key={i} onPress={() => setFilter(i)}>
              <ModalRow key={i} item={item} filter={filter} index={i} />
            </Pressable>
          ))}
          <Gap height={24} />
          <Pressable style={styles.showButton}>
            <TextInter style={styles.showButtonLabel}>
              Tampilkan Hasil
            </TextInter>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Marketplace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarContainer: {
    zIndex: 10,
  },
  scrollView: {
    backgroundColor: theme.colors.MPWhite2,
  },

  categoriesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 11,
    alignItems: 'center',
  },
  categories: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.grey1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeCategory: {
    color: theme.colors.MPBlue1,
    borderBottomColor: theme.colors.MPBlue1,
    borderBottomWidth: 1,
  },

  searchSection: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: theme.colors.searchInput.fill,
    borderWidth: 1,
    borderColor: theme.colors.searchInput.border,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  searchInput: {
    padding: 0,
    flex: 1,
    color: theme.colors.grey1,
    fontFamily: theme.fonts.inter.medium,
    fontSize: 14,
  },
  searchButtonContainer: {
    backgroundColor: theme.colors.searchInput.buttonFill,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.MPWhite2,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.grey1,
  },

  sectionTitleContainer: {
    width: '100%',
    backgroundColor: theme.colors.MPWhite4,
    paddingVertical: 9,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.MPGrey2,
  },

  flatListHorizontal: {
    paddingHorizontal: 24,
  },

  footer: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingTop: screenHeightPercentage('2%'),
    paddingBottom: screenHeightPercentage('3%'),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 44,

    elevation: 10,
  },
  footerButton: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.MPBlue2,
    borderRadius: 16,
  },
  footerLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.MPWhite,
  },

  modalContainer: {
    paddingTop: 14,
  },
  modalTitle: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 24,
    color: theme.colors.MPGrey3,
    marginLeft: 24,
  },
  modalSort: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.MPGrey3,
    marginLeft: 24,
  },

  showButton: {
    marginHorizontal: 24,
    backgroundColor: theme.colors.MPBlue2,
    borderRadius: 5.75,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  showButtonLabel: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 14,
    color: theme.colors.fontLight,
  },
});
