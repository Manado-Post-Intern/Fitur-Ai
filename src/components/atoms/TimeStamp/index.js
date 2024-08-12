import {StyleSheet} from 'react-native';
import React from 'react';
import TextInter from '../TextInter';
import {theme} from '../../../assets';
import moment from 'moment';

const TimeStamp = ({type, data}) => {
  return (
    <TextInter style={[styles.timeStamp, type === 'small' && styles.small]}>
      {moment(data).format('DD MMMM YYYY hh:mm a')}
    </TextInter>
  );
};

export default TimeStamp;

const styles = StyleSheet.create({
  timeStamp: {
    fontSize: 10,
    color: theme.colors.headlines.timeStamps.color,
  },
  small: {
    fontSize: 6.5,
  },
});
