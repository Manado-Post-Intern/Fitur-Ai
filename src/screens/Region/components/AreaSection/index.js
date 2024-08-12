import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, More, TextInter} from '../../../../components';
import {IMGLogoManado, theme} from '../../../../assets';
import Card from '../Card';
import {regionList} from '../../../../data';

const data = [0, 1, 2];

const AreaSection = ({item}) => {
  const regionId = regionList.find(region => region.name === item?.region)?.id;
  const regionLogo = regionList.find(
    region => region.name === item?.region,
  )?.icon_url;
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={regionLogo} />
        <Gap width={10} />
        <TextInter style={styles.title}>{item?.region}</TextInter>
      </View>

      {item?.latest?.slice(0, 3).map((item, i) => (
        <Card key={i} item={item} />
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
