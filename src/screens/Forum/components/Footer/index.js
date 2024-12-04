/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IcAboutForum, IcBackButtonForum, IcCreateStatus} from '../../assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonSize}
          onPress={() => navigation.goBack()}>
          <IcBackButtonForum />
          <Text style={styles.buttonText}>To Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.createStatus}>
        <TouchableOpacity>
          <IcCreateStatus />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSize}>
          <IcAboutForum />
          <Text style={styles.buttonTextAbout}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // position: 'absolute',
  },
  buttonContainer: {},
  buttonSize: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    color: '#00599B',
    marginTop: 3,
  },
  buttonTextAbout: {
    fontSize: 13,
    color: '#00599B',
  },
  createStatus: {
    marginHorizontal: 74,
  },
});
