import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import {IMGDummyNews, theme} from '../../../../assets';
import {TextInter} from '../../../../components';

const Story = () => {
  return (
    <ImageBackground
      style={styles.container}
      source={IMGDummyNews}
      imageStyle={styles.imageStyle}>
      <View style={styles.filter}>
        <TextInter style={styles.label}>Story</TextInter>
      </View>
    </ImageBackground>
  );
};

export default Story;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    marginHorizontal: 4,
  },
  imageStyle: {
    borderRadius: 8,
  },
  filter: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    paddingBottom: 9,
    paddingHorizontal: 6,
    backgroundColor: '#05478373',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.white,
  },
});
