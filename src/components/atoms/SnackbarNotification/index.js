import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {IcXSmall} from '../../../assets';
import TTSButton from '../TtsButton';
import {useNavigation} from '@react-navigation/native';

const SnackbarNotification = ({visible, onDismiss, isActive, onPress}) => {
  const navigation = useNavigation();
  return (
    <Snackbar
      visible={visible}
      onDismiss={() => {}}
      style={styles.snackbar}
      duration={Snackbar.DURATION_INDEFINITE}>
      <View style={styles.container}>
        <Text style={styles.textSnackbar}>Judul</Text>
        <View style={styles.actions}>
          <TTSButton isActive={isActive} onPress={onPress} />
          <TouchableOpacity onPress={onDismiss} style={styles.closeIcon}>
            <IcXSmall />
          </TouchableOpacity>
        </View>
      </View>
    </Snackbar>
  );
};

export default SnackbarNotification;

const styles = StyleSheet.create({
  snackbar: {
    position: 'relative',
    bottom: 100,
    width: 220,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 'auto',
    shadowOpacity: 100,
    elevation: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textSnackbar: {
    color: 'black',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    marginLeft: 10,
  },
});
