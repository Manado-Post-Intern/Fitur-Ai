import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Snackbar} from 'react-native-paper';

const SnackbarNotification = ({visible, onDismiss, message}) => {
  return (
    <Snackbar visible={visible} onDismiss={onDismiss} style={styles.snackbar}>
      <Text style={styles.textSnackbar}>{message}</Text>
    </Snackbar>
  );
};

export default SnackbarNotification;

const styles = StyleSheet.create({
  snackbar: {
    position: 'relative',
    bottom: 120,
    width: 400,
    height: 23,
    marginVertical: 10,
    backgroundColor: 'rgba(2, 77, 145, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSnackbar: {
    color: 'white',
    textAlign: 'center',
  },
});
