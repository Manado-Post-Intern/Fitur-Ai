// src/components/ErrorNotification.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useErrorNotification} from '../../../context/ErrorNotificationContext'; // Import context
import {IcError} from '../../../assets';

const ErrorNotification = () => {
  const {isErrorVisible, errorMessage} = useErrorNotification();

  if (!isErrorVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <IcError />
      <View style={styles.wrapErrorMessage}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.message}>{errorMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
  },
  wrapErrorMessage: {
    paddingLeft: 10,
  },
});

export default ErrorNotification;
