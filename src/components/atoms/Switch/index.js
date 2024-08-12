import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import TextInter from '../TextInter';
import {theme} from '../../../assets';
import LinearGradient from 'react-native-linear-gradient';

const Switch = ({onChange = () => {}, defaultValue = true}) => {
  const [active, setActive] = useState(defaultValue);
  useEffect(() => {
    onChange(active);
  }, [active]);
  if (active) {
    return (
      <Pressable style={styles.container} onPress={() => setActive(false)}>
        <View style={styles.statusContainer}>
          <TextInter style={styles.statusActive}>on</TextInter>
        </View>
        <LinearGradient colors={['#3DB9FF', '#0089D6']} style={styles.circle} />
      </Pressable>
    );
  } else {
    return (
      <Pressable style={styles.container} onPress={() => setActive(true)}>
        <View style={styles.circle} />
        <View style={styles.statusContainer}>
          <TextInter style={styles.status}>off</TextInter>
        </View>
      </Pressable>
    );
  }
};

export default Switch;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 45,
    height: 19,
    backgroundColor: theme.colors.MPWhite,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 19,
    height: 19,
    borderRadius: 20,
    backgroundColor: '#B4B5B7',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  status: {
    color: theme.colors.MPGrey2,
    fontSize: 14,
    lineHeight: 14,
  },
  statusActive: {
    color: theme.colors.MPBlue2,
    fontSize: 14,
    lineHeight: 14,
  },
});
