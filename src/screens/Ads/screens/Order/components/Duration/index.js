import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IcDropdownArrow, theme} from '../../../../../../assets';
import {TextInter} from '../../../../../../components';
import OptionRow from './OptionRow';

const dataAll = ['1 Bulan', '2 Bulan', '3 Bulan', '6 Bulan'];

const Duration = ({label, onDurationSelect = () => {}}) => {
  const [choosed, setChoosed] = useState('1 Bulan');
  const [durationOption, setDurationOption] = useState(false);

  const handleChoose = item => {
    setChoosed(item);
    setDurationOption(false);
  };

  useEffect(() => {
    onDurationSelect(choosed);
  }, [choosed]);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Durasi</Text>
      <View>
        <Pressable onPress={() => setDurationOption(!durationOption)}>
          <Pressable
            style={styles.fieldContainer}
            onPress={() => setDurationOption(!durationOption)}>
            <TextInter style={styles.activeItem}>{choosed}</TextInter>
            <View>
              <IcDropdownArrow />
            </View>
          </Pressable>
        </Pressable>
        {durationOption && (
          <View style={styles.optionContainer}>
            <FlatList
              data={dataAll}
              renderItem={({item, index}) => (
                <Pressable onPress={() => handleChoose(item)}>
                  <OptionRow index={index} item={item} />
                </Pressable>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Duration;

const styles = StyleSheet.create({
  container: {
    width: 112,
  },

  label: {
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
  activeItem: {
    fontSize: 14,
    color: theme.colors.grey1,
  },
  itemContainer: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 4,
  },
  itemLabel: {
    color: theme.colors.grey1,
    fontSize: 14,
  },

  optionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    top: '100%',
  },
});
