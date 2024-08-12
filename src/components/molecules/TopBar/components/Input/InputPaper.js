import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {Gap} from '../../../../atoms';
import {IcCalendar, IcSearchGray, theme} from '../../../../../assets';
import {useNavigation} from '@react-navigation/native';

const STYLES = {
  height: 36,
};

const InputPaper = ({calendarModal}) => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Cari Edisi atau Judul"
            placeholderTextColor={'#96969680'}
          />
          <Pressable
            style={styles.searchButtonContainer}
            onPress={() => navigation.navigate('SearchPaper')}>
            <IcSearchGray />
          </Pressable>
        </View>
        <Gap width={8} />
        <Pressable
          style={styles.calendarContainer}
          onPress={() => calendarModal(true)}>
          <IcCalendar />
        </Pressable>
      </View>
      <Gap height={15} />
    </>
  );
};

export default InputPaper;

const styles = StyleSheet.create({
  container: {
    height: STYLES.height,
    flexDirection: 'row',
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#DFE8F566',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 16,
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

  calendarContainer: {
    width: STYLES.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.MPGrey2,
  },
});
