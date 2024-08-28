// src/components/PersistentText.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PersistentText = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Adjust this value based on the height of your navbar
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000', // Customize this color
  },
});

export default PersistentText;
