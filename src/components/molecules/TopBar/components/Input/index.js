import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {IcSearchGray, theme} from '../../../../../assets';
import {TextInter} from '../../../../atoms';
import {useNavigation} from '@react-navigation/native';

const dummy = [
  'Manado',
  'Minahasa',
  'Minahasa Utara',
  'Minahasa Selatan',
  'Minahasa Tenggara',
];

const Input = ({
  searchRef,
  setSearching,
  searching,
  setActiveSearch,
  searchOnly,
  type,
  onPress = () => {},
}) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    setActiveSearch(false);
    if (type === 'home' || type.length === 0) {
      navigation.navigate('Search');
    } else if (type === 'region') {
      navigation.navigate('RegionSearch');
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        ref={searchRef}
        style={styles.searchInput}
        placeholder="Cari Berita disini"
        placeholderTextColor="#C9C9C9"
        onFocus={() => setSearching(true)}
        onBlur={() => setSearching(false)}
        onChangeText={text => setSearch(text)}
        value={search}
      />
      <TouchableOpacity
        style={styles.searchButtonContainer}
        onPress={() => onPress(search)}>
        <IcSearchGray />
      </TouchableOpacity>
      {searching && !searchOnly && (
        <View style={styles.suggestionContainer}>
          {dummy.map((item, i) => (
            <TextInter style={styles.suggestionItem} key={i}>
              {item}
            </TextInter>
          ))}
        </View>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: theme.colors.searchInput.fill,
    borderWidth: 1,
    borderColor: theme.colors.searchInput.border,
    borderRadius: 16,
    paddingHorizontal: 10,

    marginTop: 8,
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

  suggestionContainer: {
    width: '100%',
    position: 'absolute',
    backgroundColor: theme.colors.white,
    top: 40,
    borderRadius: 8,
    alignSelf: 'center',
    left: 10,
    zIndex: 100,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,

    elevation: 5,
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  suggestionItem: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 14,
    color: theme.colors.MPGrey3,
  },
});
