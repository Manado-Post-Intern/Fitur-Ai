import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const SummarizeFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleButton}>
        <View style={styles.crossContainer}>
          <View style={[styles.line, isOpen && styles.line1Open]} />
          <View
            style={[
              styles.line,
              styles.verticalLine,
              isOpen && styles.line2Open,
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  crossContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  line: {
    position: 'absolute',
    width: 24,
    height: 3,
    backgroundColor: '#024D91',
    top: '50%',
    left: 0,
    // transform: [{translateY: -1.5}],
  },
  verticalLine: {
    transform: [{rotate: '90deg'}],
  },
  line1Open: {
    transform: [{rotate: '45deg'}],
    top: 10.5,
    left: 0,
  },
  line2Open: {
    transform: [{rotate: '-45deg'}],
    top: 10.5,
    left: 0,
  },
});

export default SummarizeFloatingButton;
