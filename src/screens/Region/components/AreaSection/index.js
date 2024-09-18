import {Image, StyleSheet, View} from 'react-native';
import React,{useState} from 'react';
import {Gap, More, TextInter} from '../../../../components';
import {IMGLogoManado, theme} from '../../../../assets';
import Card from '../Card';
import {regionList} from '../../../../data';
import { useSnackbar } from '../../../../context/SnackbarContext';

const data = [0, 1, 2];

const AreaSection = ({item}) => {
  const regionId = regionList.find(region => region.name === item?.region)?.id;
  const regionLogo = regionList.find(
    region => region.name === item?.region,
  )?.icon_url;

  const {showSnackbar, hideSnackbar, toggleSnackbar} = useSnackbar(); // Gunakan fungsi dari SnackbarContext

  const [activeTTS, setActiveTTS] = useState(null);

  const handleTTSPress = id => {
    if (activeTTS !== null && activeTTS !== id) {
      setActiveTTS(null);
      hideSnackbar(); // Tutup Snackbar jika TTS berbeda ditekan
    }

    if (activeTTS === id) {
      setActiveTTS(null);
      // hideSnackbar();
    } else {
      setActiveTTS(id);
      // showSnackbar('Text-to-Speech is active', 'black'); // Tampilkan Snackbar dengan pesan
    }
  };

  const handleSendTitle = (title,id) => {
    // setSelectedTitle(title); // Update title yang dipilih
    // titleRef.current = title; // Update nilai di useRef
    if (activeTTS === id) {
      hideSnackbar();
    } else {
      showSnackbar(`${title}`, 'black'); // Tampilkan Snackbar dengan pesan
      console.log(title);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={regionLogo} />
        <Gap width={10} />
        <TextInter style={styles.title}>{item?.region}</TextInter>
      </View>

      {item?.latest?.slice(0, 3).map((item, i) => (
        <Card key={i} item={item} isActive={activeTTS === item.id}
        onPress={() => handleTTSPress(item.id)} 
        onSendTitle={handleSendTitle} // Kirim handleSendTitle ke Card
        />
      ))}

      <More sectionId={regionId} />
    </View>
  );
};

export default AreaSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  titleContainer: {
    paddingLeft: 24,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.MPWhite4,
  },
  logo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: theme.colors.MPGrey2,
  },
});
