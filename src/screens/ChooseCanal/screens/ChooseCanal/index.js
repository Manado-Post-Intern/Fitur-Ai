import {FlatList, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {screenHeightPercentage} from '../../../../utils';
import {Button, Gap, GlowCircle, TextInter} from '../../../../components';
import {IMGMPText, theme} from '../../../../assets';
import {SelectionRow} from '../../../Home/components/NewsForYou/components/CanalModal/components';
import {canal} from '../../../../data';

// const data = [
//   'News',
//   'Politik',
//   'Budaya',
//   'Pendidikan',
//   'Entertainment',
//   'Sport',
//   'Daerah',
//   'Internasional',
//   'Bisnis',
//   'Daerah',
//   'Internasional',
//   'Internasional',
//   'Internasional',
//   'Internasional',
//   'Internasional',
//   'Internasional',
// ];

const ChooseCanal = ({navigation}) => {
  const [choosed, setChoosed] = useState([]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Gap height={screenHeightPercentage('5%')} />
        <View style={styles.topGlowCircleContainer}>
          <GlowCircle />
        </View>
        <View style={styles.MPTextContainer}>
          <Image style={styles.MPText} source={IMGMPText} />
        </View>
        <Gap height={screenHeightPercentage('2%')} />
        <View style={styles.bodyContainer}>
          <TextInter style={styles.instruction}>Pilih Kanal</TextInter>
          <TextInter style={styles.subInstruction}>
            Bantu kami mengenal preferensi anda lebih jauh
          </TextInter>

          <Gap height={29} />

          <FlatList
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatList}
            data={canal}
            renderItem={({item, i}) => (
              <SelectionRow
                key={i}
                item={item}
                setActive={setChoosed}
                activeList={choosed}
              />
            )}
          />
        </View>

        <Button
          style={styles.nextButton}
          label="Lanjutkan"
          type="secondary"
          onPress={() => {
            if (choosed.length === 0) {
              alert('Pilih minimal 1 kanal');
            } else {
              navigation.navigate('ChooseRegion', {choosedCanal: choosed});
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChooseCanal;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.primary,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  MPTextContainer: {
    width: '100%',
  },
  MPText: {
    width: 256,
    resizeMode: 'contain',
  },

  topGlowCircleContainer: {
    position: 'absolute',
    top: -270,
  },

  bodyContainer: {
    width: '100%',
  },
  instruction: {
    fontSize: 24,
    color: theme.colors.fontLight,
    opacity: 0.75,
    fontFamily: theme.fonts.inter.semiBold,
  },
  subInstruction: {
    fontSize: 14,
    color: theme.colors.fontLight,
  },
  flatListContainer: {
    height: screenHeightPercentage('57%'),
  },
  flatList: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.skyBlue,
    flexGrow: 1,
  },

  nextButton: {
    position: 'absolute',
    bottom: screenHeightPercentage('5%'),
    backgroundColor: theme.colors.skyBlue,
    height: 36,
  },
});
