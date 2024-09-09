import React, {useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {IcTtsPlay, IcTtsPause} from '../../../assets';
import Tts from 'react-native-tts';
import {useSnackbar} from '../../../context/SnackbarContext'; // Import context

const TTSButton = ({isActive, onPress, content}) => {
  const {setCleanArticle} = useSnackbar(); // Dapatkan fungsi setCleanContent dari context

  const handlePress = () => {
    // Set the default language to Indonesian
    Tts.setDefaultLanguage('id-ID');

    if (content) {
      // Clean the content if it exists
      const cleanContent = content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .toLowerCase()
        .replace(/manadopost\.id/gi, '');

      setCleanArticle(cleanContent); // Kirim cleanContent ke context
      // Trigger Tts.speak or Tts.stop based on isActive
      if (isActive) {
        Tts.stop();
      } else {
        Tts.speak(cleanContent);
      }
    } else {
      console.log('Content is undefined or null');
    }

    // Call the passed onPress function
    if (onPress) {
      onPress();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        {isActive ? (
          <IcTtsPause width={24} height={24} />
        ) : (
          <IcTtsPlay width={24} height={24} />
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default TTSButton;
