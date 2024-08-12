import {StyleSheet, View} from 'react-native';
import React from 'react';
// import {
//   Ic3DPaper,
//   Ic3DPaperActive,
//   IcMeta,
//   IcMetaActive,
//   IcMP,
//   IcRegion,
//   IcRegionActive,
//   IcTrending,
//   IcTrendingActive,
//   theme,
// } from '../../assets';
// import {TextInter} from '../../components';
import {
  Ic3DPaper,
  Ic3DPaperActive,
  IcMeta,
  IcMetaActive,
  IcMP,
  IcRegion,
  IcRegionActive,
  IcTrending,
  IcTrendingActive,
  theme,
} from '../../../assets';
import {TextInter} from '../../atoms';

const BottomTabBar = ({route, focused}) => {
  switch (route.name) {
    case 'Trending': {
      if (focused) {
        return (
          <View style={styles.container}>
            <View style={[styles.inner, focused && styles.active]}>
              <IcTrendingActive />
              <TextInter style={styles.labelActive}>Trending</TextInter>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <IcTrending />
          <TextInter style={styles.label}>Trending</TextInter>
        </View>
      );
    }

    case 'Region': {
      if (focused) {
        return (
          <View style={styles.container}>
            <View style={[styles.inner, focused && styles.active]}>
              <IcRegionActive />
              <TextInter style={styles.labelActive}>Daerah</TextInter>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <IcRegion />
          <TextInter style={styles.label}>Daerah</TextInter>
        </View>
      );
    }

    case 'Home': {
      if (focused) {
        return (
          <View style={styles.container}>
            <View style={styles.homeContainerActive}>
              <IcMP />
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <View style={styles.homeContainer}>
            <IcMP />
          </View>
        </View>
      );
    }

    case 'Meta': {
      if (focused) {
        return (
          <View style={styles.container}>
            <View style={[styles.inner, focused && styles.active]}>
              <IcMetaActive />
              <TextInter style={styles.labelActive}>Meta</TextInter>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <IcMeta />
          <TextInter style={styles.label}>Meta</TextInter>
        </View>
      );
    }

    case 'Paper3D': {
      if (focused) {
        return (
          <View style={styles.container}>
            <View style={[styles.inner, focused && styles.active]}>
              <Ic3DPaperActive />
              <TextInter style={styles.labelActive}>3D-Paper</TextInter>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <Ic3DPaper />
          <TextInter style={styles.label}>3D-Paper</TextInter>
        </View>
      );
    }
  }
};

export default BottomTabBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 12,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: theme.colors.skyBlue,
    minWidth: 60,
    height: 60,
    padding: 8,
    borderRadius: 8,
  },
  label: {
    fontSize: 10,
    color: theme.colors.MPBlue1,
  },
  labelActive: {
    fontSize: 10,
    fontFamily: theme.fonts.inter.semiBold,
    color: theme.colors.white,
  },
  homeContainer: {
    height: 65,
    width: 65,
    borderRadius: 30,
    backgroundColor: theme.colors.MPBlue1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ECECEC',
  },
  homeContainerActive: {
    height: 65,
    width: 65,
    borderRadius: 30,
    backgroundColor: theme.colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ECECEC',
  },
});
