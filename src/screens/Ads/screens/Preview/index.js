import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  theme,
  IMGAdsPreview1,
  IMGAdsPreview2,
  IMGAdsPreview3,
  IMGAdsPreview4,
} from '../../../../assets';
import {Button, Gap, TopBar} from '../../../../components';
import {Card} from '../../../Home/components/NewsForYou/components';
import {screenHeightPercentage} from '../../../../utils';

const Preview = ({route}) => {
  const {type} = route.params;
  return (
    <View style={styles.container}>
      <ScrollView>
        {type === 'Full Page Ads' && (
          <View style={styles.adsPreviewContainer}>
            <Image style={styles.adsPreview4} source={IMGAdsPreview4} />
          </View>
        )}
        <View>
          <TopBar type="home" />
        </View>
        {type === 'Top Banner' && (
          <View style={styles.adsPreviewContainer}>
            <Image style={styles.adsPreview1} source={IMGAdsPreview1} />
          </View>
        )}
        <View>
          <View>
            <Card />
            <View style={styles.overlay} />
          </View>
          {type === 'Second Banner' && (
            <View style={styles.adsPreviewContainer}>
              <Image style={styles.adsPreview2} source={IMGAdsPreview2} />
            </View>
          )}
          {type === 'Medium Banner' && (
            <View style={styles.adsPreviewContainer}>
              <Image style={styles.adsPreview3} source={IMGAdsPreview3} />
            </View>
          )}
          <View>
            <Card />
            <View style={styles.overlay} />
          </View>
          <View>
            <Card />
            <View style={styles.overlay} />
          </View>
        </View>
        {type === 'Bottom Banner' && (
          <View style={styles.adsPreviewContainer}>
            <Image style={styles.adsPreview1} source={IMGAdsPreview1} />
          </View>
        )}
        <Gap height={screenHeightPercentage('11%')} />
      </ScrollView>

      <View style={styles.footerContainer}>
        <Button label="Pasang Iklan" />
      </View>
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: theme.colors.darkBright,
  },
  adsPreviewContainer: {
    paddingHorizontal: 20,
  },
  adsPreview1: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
  },
  adsPreview2: {
    height: 150,
    width: '100%',
    resizeMode: 'contain',
  },
  adsPreview3: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
  adsPreview4: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(256,256,256,0.5)',
  },
});
