import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Gap, TopBar} from '../../../../components';
import {IcBack, theme} from '../../../../assets';
import {useNavigation} from '@react-navigation/native';
import {screenHeightPercentage} from '../../../../utils';
import WebView from 'react-native-webview';

const ReadPaper = ({route}) => {
  const {item} = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <TopBar type="paper" />
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <IcBack />
          </Pressable>
        </View>
      </View>

      <WebView style={{flex: 1}} source={{uri: item?.pdf_link}} />

      <Gap height={screenHeightPercentage('15%')} />
    </View>
  );
};

export default ReadPaper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white2,
    flex: 1,
  },
  topBarContainer: {
    zIndex: 100,
  },

  bodyContainer: {
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
});
