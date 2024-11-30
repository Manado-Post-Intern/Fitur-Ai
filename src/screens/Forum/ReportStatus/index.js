/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import {useState, useRef, useMemo} from 'react';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {IcClose, IcOption} from '../assets';

const ReportStatus = ({navigation}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState('main');
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const translateX = useSharedValue(300);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleOptionPress = () => {
    setCurrentContent('detail');
    setIsDetailVisible(true);
    translateX.value = withTiming(0, {duration: 500});
  }; // <-- Tambahkan penutupan kurung kurawal di sini

  const handleBackPress = () => {
    translateX.value = withTiming(300, {duration: 500}, () => {
      setIsDetailVisible(false);
      setCurrentContent('main');
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <GestureHandlerRootView style={{flex: 1}} key={refreshKey}>
      <View style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}>
          <View>
            <Text style={styles.laporkan}>Laporkan</Text>
            {!isDetailVisible && (
              <View>
                <View style={styles.line} />
                <Text style={styles.title}>
                  Mengapa anda melaporkan postingan ini?
                </Text>

                {/* Tombol-tombol opsi laporan */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOptionPress}>
                  <Text style={styles.option}>Berita palsu</Text>
                  <View style={styles.click}>
                    <IcOption />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOptionPress}>
                  <Text style={styles.option}>Perundungan atau Pelecehan</Text>
                  <View style={styles.click}>
                    <IcOption />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOptionPress}>
                  <Text style={styles.option}>Pelanggaran privasi</Text>
                  <View style={styles.click}>
                    <IcOption />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOptionPress}>
                  <Text style={styles.option}>Spam</Text>
                  <View style={styles.click}>
                    <IcOption />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOptionPress}>
                  <Text style={styles.option}>Lainnya</Text>
                  <View style={styles.click}>
                    <IcOption />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Konten Detail */}
            {isDetailVisible && (
              <Animated.View style={[styles.detailContainer, animatedStyle]}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}>
                  <Text style={styles.backText}>Kembali</Text>
                </TouchableOpacity>

                {/* Konten baru yang ditampilkan */}
                {currentContent === 'detail' && (
                  <>
                    <Text style={styles.title}>Detail Laporan</Text>
                    <Text style={styles.detailText}>
                      Detail dari opsi yang dipilih...
                    </Text>
                    {/* Tambahkan konten detail sesuai kebutuhan */}
                  </>
                )}
              </Animated.View>
            )}
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default ReportStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B0DBF3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  laporkan: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row', // Ensure icon and text are in a row
    alignItems: 'center',
    marginVertical: 20,
  },
  option: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 22,
    color: 'black',
  },
  click: {
    marginLeft: 'auto', // Move icon to the far right
    marginRight: 25,
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#0000FF',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: 'black',
    marginLeft: 22,
  },
  detailText: {
    fontSize: 18,
    color: '#555555',
    marginLeft: 22,
    marginTop: 10,
  },
});
