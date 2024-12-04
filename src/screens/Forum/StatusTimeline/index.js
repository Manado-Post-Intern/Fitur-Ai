/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import {React, useState, useEffect, useRef, useMemo, useCallback} from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import {Gap} from '../../../components';
import {
  TouchableOpacity,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import {IcPencil} from '../assets';
import ReportBottomSheet from '../components/ReportBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import NetInfo from '@react-native-community/netinfo';

const StatusTimeline = ({navigation, route}) => {
  const scrollViewRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [postedId, setPostedId] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleRefresh = useCallback(() => {
    const currentScrollY = scrollY;
    setRefreshKey(prevKey => prevKey + 1);

    setTimeout(() => {
      // Use scrollTo instead of scrollToOffset for ScrollView
      scrollViewRef.current?.scrollTo({
        y: currentScrollY,
        animated: false,
      });
    }, 100);
  }, [scrollY]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const shouldRefresh = route.params?.refresh || false;
      if (shouldRefresh) {
        handleRefresh();
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.refresh, handleRefresh]);

  const openBottomSheet = id => {
    setPostedId(id);
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  const handleScroll = event => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container} key={refreshKey}>
        <Header onRefresh={handleRefresh} />
        <Gap height={10} />
        <TouchableOpacity
          style={styles.createStatusButton}
          onPress={() => navigation.navigate('CreateStatus')}>
          <View style={styles.createStatusButton}>
            <Text style={styles.createStatusTextStyle}>Tulis Laporan Anda</Text>
            <IcPencil />
          </View>
        </TouchableOpacity>
        <Gap height={5} />
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.content}
          key={refreshKey}>
          <Card onReportPress={openBottomSheet} connection={isConnected} />
          <Gap height={120} />
        </ScrollView>
        {isBottomSheetVisible && (
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setBottomSheetVisible(false)}>
            <ReportBottomSheet onClose={closeBottomSheet} postedId={postedId} />
          </BottomSheet>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default StatusTimeline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7F0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#E7F0F5',
  },
  createStatusButton: {
    flexDirection: 'row',
    width: 402,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00599B',
    borderRadius: 16,
  },
  createStatusTextStyle: {
    fontSize: 13,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: 'semibold',
  },
  bottomSheetWide: {
    width: 400,
  },
});
