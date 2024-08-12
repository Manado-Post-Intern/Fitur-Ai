import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';

const Input = props => {
  const {placeholder, isDescription} = props;
  return (
    <View style={[styles.inputContainer, isDescription && styles.description]}>
      <TextInput
        style={[styles.linkInput, isDescription && styles.descriptionInput]}
        placeholder={placeholder}
        multiline={isDescription}
        placeholderTextColor="#617D9780"
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DFE8F566',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
  },
  description: {
    height: 92,
    justifyContent: 'flex-start',
  },
  descriptionInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    height: '100%',
  },
  linkInput: {
    color: '#617D97',
  },
});
