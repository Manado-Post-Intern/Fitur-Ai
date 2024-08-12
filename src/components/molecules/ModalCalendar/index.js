import {Alert, Modal, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import {theme} from '../../../assets';

const ModalCalendar = ({isOpen, setIsOpen, onDayPress = () => {}}) => {
  const handleDayPress = day => {
    onDayPress(day);
    setIsOpen(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setIsOpen(!isOpen);
      }}>
      <Pressable
        style={styles.centeredView}
        onPress={e => {
          e.stopPropagation();
          setIsOpen(false);
        }}>
        <Pressable style={styles.modalView}>
          <Calendar style={styles.calendar} onDayPress={handleDayPress} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ModalCalendar;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: 308,
    height: 400,
    backgroundColor: theme.colors.white,
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,

    elevation: 5,
  },
  calendar: {
    borderRadius: 16,
  },
});
