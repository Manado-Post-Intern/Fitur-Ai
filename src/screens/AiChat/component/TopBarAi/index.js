import {Image, View, StyleSheet} from 'react-native';
import React from 'react';
import {IcBackButton, IMGMPTextPrimary, theme} from '../../../../assets';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TopBarAi = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <IcBackButton />
        </Pressable>
        <Image style={styles.image} source={IMGMPTextPrimary} />
        <View style={styles.topActionContainer}>
          {/* Additional action buttons can go here */}
        </View>
      </View>
    </View>
  );
};

export default TopBarAi;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensure space between back button and image
    alignItems: 'center',
    paddingHorizontal: 22, // Adjust padding as needed
  },
  image: {
    left: -60,
    width: 149,
    resizeMode: 'contain',
  },
  topActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 5, // Add some padding if needed
  },
});
