import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';

const GlowCircle = ({color}) => {
  const screenWidth = Dimensions.get('screen').width;
  return (
    <View style={styles.middleGlow}>
      <Svg height={screenWidth} width={screenWidth}>
        <Defs>
          <RadialGradient
            id="grad-8"
            cx="50%" //Set the radius corner by x
            cy="50%" //Set the radius corner by y
            r="50%" //Set the gradient radius
          >
            <Stop
              offset="0"
              stopColor={color ? color : '#ffffff'} //Set the Gradient color(From)
              stopOpacity="0.15"
            />
            <Stop
              offset="1"
              stopColor="#ffffff" //Set the Gradient color(To)
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={screenWidth}
          fill="url(#grad-8)"
        />
      </Svg>
    </View>
  );
};

export default GlowCircle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
    zIndex: 0,
  },
});
