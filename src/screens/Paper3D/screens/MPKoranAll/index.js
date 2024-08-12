import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Gap, Pagination, TextInter, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import {screenHeightPercentage} from '../../../../utils';
import Card from './Card';
import {useNavigation} from '@react-navigation/native';
import {MPDigitalContext} from '../../../../context/MPDigitalContext';
import moment from 'moment';
import ModalCalendar from '../../../../components/molecules/ModalCalendar';
import {InputPaper} from '../../../../components/molecules/TopBar/components';

// const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MPKoranAll = () => {
  const [calendarModal, setCalendarModal] = useState(false);
  const [day, setDay] = useState('');
  const navigation = useNavigation();
  const {newsPaper} = useContext(MPDigitalContext);

  const filtered = newsPaper.filter(
    item => moment(item?.publish_date).format('YYYY-MM-DD') === day,
  );
  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <View style={styles.bodyContainer}>
        <Gap height={12} />

        <View style={styles.flatListContainer}>
          <FlatList
            ListHeaderComponent={() => (
              <View style={styles.headerContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Pressable onPress={() => navigation.goBack()}>
                    <IcBack />
                  </Pressable>
                  <TextInter style={styles.headerText}>MP Koran</TextInter>
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
            data={day ? filtered : newsPaper}
            numColumns={3}
            renderItem={({item, index}) => (
              <Card
                key={index}
                index={index}
                dataLength={newsPaper?.length}
                item={item}
              />
            )}
          />
        </View>
      </View>

      {/* <Pagination /> */}

      <Gap height={screenHeightPercentage('15%')} />
      <ModalCalendar
        isOpen={calendarModal}
        setIsOpen={setCalendarModal}
        onDayPress={value => setDay(value.dateString)}
      />
    </View>
  );
};

export default MPKoranAll;

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
    marginVertical: 12,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },

  flatListContainer: {
    paddingHorizontal: 17,
  },
});
