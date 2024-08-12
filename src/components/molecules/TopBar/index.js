import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {
  IcMagnifying,
  IcMetaMP,
  IcSort,
  IMGMPTextPrimary,
  theme,
} from '../../../assets';
import {Gap} from '../../atoms';
import {Category, Input, InputMeta, InputPaper} from './components';
import ModalCalendar from '../ModalCalendar';
import {useNavigation} from '@react-navigation/native';
import {sectionList} from '../../../data';

const TopBar = ({searchOnly, type, onSearchPress}, props) => {
  const navigation = useNavigation();

  const [active, setActive] = useState(0);
  const [activeSearch, setActiveSearch] = useState(false);

  const [searching, setSearching] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);

  const searchRef = createRef(null);

  const handleBurgerPress = () => {
    navigation.navigate('SideMenu');
  };

  useEffect(() => {
    searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSearch, searchRef.current]);
  switch (type) {
    case 'meta': // META
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              {!activeSearch && (
                <Pressable
                  onPress={() => {
                    setActiveSearch(true);
                  }}>
                  <IcMagnifying />
                </Pressable>
              )}
              <Gap width={24} />
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
            </View>
          </View>

          {activeSearch && <InputMeta />}
        </View>
      );
    case 'paper': // PAPER
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              {/* {!activeSearch && (
                <Pressable
                  onPress={() => {
                    setActiveSearch(true);
                  }}>
                  <IcMagnifying />
                </Pressable>
              )} */}
              <Gap width={24} />
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
            </View>
          </View>

          {activeSearch && <InputPaper calendarModal={setCalendarModal} />}
          <ModalCalendar isOpen={calendarModal} setIsOpen={setCalendarModal} />
        </View>
      );

    case 'home': // HOME
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              {!activeSearch && !searchOnly && (
                <Pressable
                  onPress={() => {
                    // setActiveSearch(true);
                    navigation.navigate('Search');
                  }}>
                  <IcMagnifying />
                </Pressable>
              )}
              <Gap width={24} />
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
            </View>
          </View>

          {!activeSearch && !searchOnly && (
            <Category
              dummy={sectionList}
              active={active}
              setActive={setActive}
            />
          )}

          {(activeSearch || searchOnly) && (
            <Input
              searchRef={searchRef}
              setSearching={setSearching}
              searching={searching}
              setActiveSearch={setActiveSearch}
              searchOnly={searchOnly}
              type={type}
            />
          )}
          <Gap height={15} />
        </View>
      );
    case 'region': // REGION
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              {!activeSearch && !searchOnly && (
                <Pressable
                  onPress={() => {
                    // setActiveSearch(true);
                    navigation.navigate('Search');
                  }}>
                  <IcMagnifying />
                </Pressable>
              )}
              <Gap width={24} />
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
            </View>
          </View>

          {/* {!activeSearch && !searchOnly && (
            <Category dummy={dummy} active={active} setActive={setActive} />
          )} */}

          {(activeSearch || searchOnly) && (
            <Input
              searchRef={searchRef}
              setSearching={setSearching}
              searching={searching}
              setActiveSearch={setActiveSearch}
              searchOnly={searchOnly}
              type="region"
            />
          )}
          <Gap height={15} />
        </View>
      );
    case 'order': // ORDER
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
              <Gap width={24} />
              <Pressable>
                <IcMetaMP />
              </Pressable>
            </View>
          </View>

          <Gap height={15} />
        </View>
      );
    default: // FALLBACK DEFAULT
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Image style={styles.image} source={IMGMPTextPrimary} />
            <View style={styles.topActionContainer}>
              {!activeSearch && !searchOnly && (
                <Pressable
                  onPress={() => {
                    setActiveSearch(true);
                  }}>
                  <IcMagnifying />
                </Pressable>
              )}
              <Gap width={24} />
              <Pressable onPress={() => handleBurgerPress()}>
                <IcSort />
              </Pressable>
            </View>
          </View>

          {(activeSearch || searchOnly) && (
            <Input
              searchRef={searchRef}
              setSearching={setSearching}
              searching={searching}
              setActiveSearch={setActiveSearch}
              searchOnly={searchOnly}
              onPress={word => onSearchPress(word)}
            />
          )}
          <Gap height={15} />
        </View>
      );
  }
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 139,
    resizeMode: 'contain',
  },
  topActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
