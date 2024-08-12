import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {Gap, TextInter} from '../../../../../../components';
import {theme} from '../../../../../../assets';
import {SelectionRow} from './components';
import {screenHeightPercentage} from '../../../../../../utils';
import {ScrollView} from 'react-native-gesture-handler';
import {canal, regionList} from '../../../../../../data';
import database from '@react-native-firebase/database';
import {AuthContext} from '../../../../../../context/AuthContext';

const data = [...regionList, ...canal];

const CanalModal = ({canalModalRef, preferences}) => {
  const [choosed, setChoosed] = useState([]);
  const {mpUser} = useContext(AuthContext);

  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop pressBehavior="close" {...props} />,
    [],
  );

  const findMatchingData = (firstArray, secondArray) => {
    const matchingData = [];

    firstArray.forEach(nameToFind => {
      const foundData = secondArray.find(data => data.name === nameToFind);
      if (foundData) {
        matchingData.push(foundData);
      }
    });

    return matchingData;
  };

  const handleSave = async () => {
    const preferanceRef = database().ref(`/users/${mpUser.uid}/preferences/`);
    try {
      const region = findMatchingData(choosed, regionList);
      const channel = findMatchingData(choosed, canal);

      const payload = {
        region,
        channel,
      };

      await preferanceRef.update(payload);
      canalModalRef?.current?.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (preferences) {
      const data = preferences.map(item => item.name);
      setChoosed(data);
    }

    return () => {
      setChoosed([]);
    };
  }, [preferences]);

  return (
    <BottomSheetModal
      ref={canalModalRef}
      index={1}
      snapPoints={snapPoints}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{backgroundColor: theme.colors.primary}}>
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <TextInter style={styles.title}>Tambah Kanal</TextInter>
          <TouchableOpacity
            onPress={() => canalModalRef?.current?.dismiss()}
            style={styles.cancelContainer}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
        <Gap height={22} />
        <ScrollView style={styles.scrollView}>
          {data.map((item, i) => (
            <SelectionRow
              key={i}
              item={item}
              setActive={setChoosed}
              activeList={choosed}
            />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={handleSave} style={styles.saveContainer}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

export default CanalModal;

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
  },
  bodyContainer: {
    marginHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelContainer: {
    borderWidth: 1,
    borderColor: theme.colors.grey1,
    padding: 5,
    borderRadius: 10,
  },
  title: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 24,
    color: theme.colors.white,
  },
  scrollView: {
    height: screenHeightPercentage('60%'),
    paddingHorizontal: 28,
  },
  saveContainer: {
    backgroundColor: '#32c92c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginRight: 30,
    marginTop: 10,
    borderRadius: 10,

    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  saveText: {
    fontFamily: theme.fonts.inter.medium,
    color: theme.colors.white,
  },
});
