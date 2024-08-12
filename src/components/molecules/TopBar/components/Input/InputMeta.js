import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {Gap, TextInter} from '../../../../atoms';
import {IcArrowDown, IcMap, IcSearchGray, theme} from '../../../../../assets';

const STYLES = {
  height: 36,
};

const data = [
  'Manado',
  'Bitung',
  'Gorontalo',
  'Minahasa',
  'Minahasa Utara',
  'Minahasa Selatan',
  'Minahasa Tenggara',
  'Bolaang Mongondow',
];

const InputMeta = () => {
  const [dropdownActive, setDropdownActive] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.dropdownSection}>
          <Pressable
            style={styles.dropdownContainer}
            onPress={() => setDropdownActive(!dropdownActive)}>
            <TextInter style={styles.dropdownText}>Manado</TextInter>
            <View style={styles.dropdownButton}>
              <IcArrowDown />
            </View>
          </Pressable>
          {dropdownActive && (
            <View style={styles.dropdownList}>
              {data.map((item, i) => (
                <TextInter style={styles.dropdownListItem} key={i}>
                  {item}
                </TextInter>
              ))}
            </View>
          )}
        </View>
        <Gap width={8} />
        <View style={styles.searchContainer}>
          <TextInput style={styles.input} placeholder=".." />
          <View style={styles.searchButtonContainer}>
            <IcSearchGray />
          </View>
        </View>
        <Gap width={8} />
        <View style={styles.mapContainer}>
          <IcMap />
        </View>
      </View>
      <Gap height={15} />
    </>
  );
};

export default InputMeta;

const styles = StyleSheet.create({
  container: {
    height: STYLES.height,
    flexDirection: 'row',
  },

  dropdownSection: {
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: '#054783BF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderRadius: 4,
  },
  dropdownText: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 14,
    color: theme.colors.fontLight,
  },
  dropdownButton: {
    backgroundColor: '#01244580',
    height: '100%',
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    width: '100%',
    top: STYLES.height,
    borderRadius: 4,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: 'rgba(1, 36, 69, 0.1)',
  },
  dropdownListItem: {
    fontFamily: theme.fonts.inter.medium,
    fontSize: 12,
    color: theme.colors.grey1,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    height: 23,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#DFE8F566',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
  },
  searchButtonContainer: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#617D9733',
    marginRight: 10,
  },

  mapContainer: {
    width: STYLES.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: theme.colors.MPGrey2,
  },
});
