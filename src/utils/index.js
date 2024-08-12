import {Dimensions} from 'react-native';

/**
 * receive percent in string format as a params (ex: '10%')
 */
export const screenHeightPercentage = percent => {
  return Dimensions.get('window').height * (parseFloat(percent) / 100.0);
};

/**
 * screen width value
 */
export const screenWidth = percent => {
  if (percent) {
    return Dimensions.get('window').width * (parseFloat(percent) / 100.0);
  }
  return Dimensions.get('window').width;
};

export const isSlimScreen = () => {
  return screenWidth() < 380;
};
