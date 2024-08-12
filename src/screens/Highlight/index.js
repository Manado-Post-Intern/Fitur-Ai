import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useMemo, useRef} from 'react';
import {BlurView} from '@react-native-community/blur';
import BottomSheet from '@gorhom/bottom-sheet';
import {screenHeightPercentage} from '../../utils';
import {IMGDummyHighlight, IMGMinahasaLogo, theme} from '../../assets';
import {Actions, BackButton, Gap, TextInter} from '../../components';

const Highlight = () => {
  const modalRef = useRef();
  const snapPoints = useMemo(() => ['30%', '65%'], []);

  return (
    <SafeAreaView>
      <ImageBackground style={styles.container} source={IMGDummyHighlight}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <BottomSheet
          ref={modalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={styles.bottomSheet}
          handleComponent={() => <View />}
          backgroundComponent={() => (
            <BlurView
              overlayColor=""
              style={styles.blurView}
              blurType={'light'}
              blurAmount={5}
              reducedTransparencyFallbackColor={'#012445'}
            />
          )}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View style={styles.avaContainer}>
                <Image style={styles.ava} source={IMGMinahasaLogo} />
              </View>
              <Gap width={8} />
              <TextInter style={styles.title}>Kabupaten Minahasa</TextInter>
            </View>
            <Gap height={16} />
            <TextInter style={styles.body}>
              MANADOPOST.ID—Tak hanya melakukan pengabdian kepada masyarakat,
              Politeknik Negeri Manado turut berbagi ilmu di Jemaat GMIM Paulus
              Kauditan di Desa Kauditan II, Kecamatan Kauditan. {'\n'}
              {'\n'}Program Penerapan Iptek kepada Masyarakat (PIM) dilakukan
              melalui pelatihan teknologi campuran beton untuk peningkatan
              keterampilan tukang bangunan, 29 September lalu.
            </TextInter>
          </View>
        </BottomSheet>
        <View style={styles.actionsContainer}>
          <Actions border={false} type="big" />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Highlight;

const styles = StyleSheet.create({
  container: {
    height: screenHeightPercentage('100%'),
    width: '100%',
  },
  backButtonContainer: {
    top: 30,
    marginLeft: 26,
  },

  actionsContainer: {
    backgroundColor: theme.colors.white,
    paddingTop: 13,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingBottom: 25,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 20,
  },

  modalContainer: {
    paddingHorizontal: 26,
    paddingTop: 17,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avaContainer: {
    width: 37,
    height: 37,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 5,
  },
  ava: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.fontLight,
  },
  body: {
    fontSize: 14,
    color: theme.colors.fontLight,
    lineHeight: 24,
  },
});
