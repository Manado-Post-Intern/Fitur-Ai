/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image} from 'react-native';
import {React, useState} from 'react';
import {IMGMPTextPrimary} from '../../../../assets';
import {IcSearchBlue} from '../../assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Header = ({onRefresh}) => {
  const navigation = useNavigation();
  const handleRefresh = () => {
    // Memanggil fungsi refresh dari props
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <IcBack style={styles.backButtonStyle} />
        </TouchableOpacity> */}
        <Image source={IMGMPTextPrimary} style={styles.primaryTextMP} />
        <View style={styles.searchIconSize}>
          <TouchableOpacity onPress={handleRefresh}>
            <IcSearchBlue style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// export default function MainComponent() {
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleRefresh = () => {
//     // Memicu re-render halaman
//     setRefreshKey(prevKey => prevKey + 1);
//   };

//   return (
//     <View key={refreshKey}>
//       <Header onRefresh={handleRefresh} />
//       {/* Komponen lain yang akan di-refresh */}
//     </View>
//   );
// }

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 72,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  primaryTextMP: {
    height: 16,
    width: 139,
    marginLeft: 22,
    bottom: 7.7,
  },
  backButtonStyle: {
    marginTop: 3,
    marginLeft: 5,
    width: 18,
  },
  laporTextStyle: {
    fontFamily: 'NotoSerifGeorgian-Black',
    fontSize: 23,
    // fontWeight: 'bold',
    color: '#00599B',
    marginLeft: 30,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forumText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#00599B',
  },
  searchIcon: {
    marginLeft: 250,
  },
  searchIconSize: {
    width: 25,
    height: 25,
  },
});
