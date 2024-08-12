import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TextInter} from '../../../../components';
import {IcDropdownArrow, theme} from '../../../../assets';

const Dropdown = ({label, data, width, activeItem, setItem}) => {
  const [option, setOption] = useState(false);

  const handleChoose = index => {
    setItem(index);
    setOption(false);
  };
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={width ? {width} : {flex: 1}}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <Pressable onPress={() => setOption(!option)}>
          <Pressable
            style={styles.fieldContainer}
            onPress={() => setOption(!option)}>
            <TextInter style={styles.activeItem}>{data[activeItem]}</TextInter>
            <View>
              <IcDropdownArrow />
            </View>
          </Pressable>
        </Pressable>
        {option && (
          <View
            style={
              data.length > 10
                ? styles.optionContainerTop
                : styles.optionContainer
            }>
            {data.map((item, i) => (
              <Pressable key={i} onPress={() => handleChoose(i)}>
                <TextInter style={styles.item}>{item}</TextInter>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
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
    zIndex: 10,
  },
  optionContainerTop: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    bottom: '100%',
    zIndex: 10,
  },

  item: {
    paddingHorizontal: 17,
    paddingVertical: 5,
    fontSize: 14,
    fontFamily: theme.fonts.inter.medium,
    color: '#516D9B',
  },
});
