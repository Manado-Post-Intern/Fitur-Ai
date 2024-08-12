import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Gap, Pagination, TextInter, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import {screenHeightPercentage} from '../../../../utils';
import Card from './Card';
import {useNavigation} from '@react-navigation/native';
import {MPDigitalContext} from '../../../../context/MPDigitalContext';
import {InputPaper} from '../../../../components/molecules/TopBar/components';
import ModalCalendar from '../../../../components/molecules/ModalCalendar';
import moment from 'moment';

// const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MPDigitalAll = () => {
  const [calendarModal, setCalendarModal] = useState(false);
  const [day, setDay] = useState('');
  const navigation = useNavigation();
  const {magazine} = useContext(MPDigitalContext);

  const filtered = magazine.filter(
    item => moment(item?.publish_date).format('YYYY-MM-DD') === day,
  );
  return (
    <>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row'}}>
              <Pressable onPress={() => navigation.goBack()}>
                <IcBack />
              </Pressable>
              <TextInter style={styles.headerText}>MP Digital</TextInter>
            </View>
            <View style={{flexDirection: 'row'}}>
              <InputPaper calendarModal={setCalendarModal} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setDay('')}
                style={{
                  backgroundColor: theme.colors.MPGrey2,
                  justifyContent: 'center',
                  padding: 5,
                  marginLeft: 5,
                  borderRadius: 8,
                }}>
                <Text>Clear Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.contentContainerStyle}
        data={day ? filtered : magazine}
        numColumns={3}
        renderItem={({item, index}) => (
          <Card
            key={index}
            index={index}
            dataLength={magazine.length}
            item={item}
          />
        )}
      />

      {/* <Pagination /> */}
      <Gap height={30} />
      <ModalCalendar
        isOpen={calendarModal}
        setIsOpen={setCalendarModal}
        onDayPress={value => setDay(value.dateString)}
      />
    </>
  );
};

export default MPDigitalAll;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
  },
  topBarContainer: {
    zIndex: 100,
  },

  bodyContainer: {
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },
  contentContainerStyle: {
    paddingHorizontal: 17,
    paddingBottom: screenHeightPercentage('10.5%'),
  },
});
