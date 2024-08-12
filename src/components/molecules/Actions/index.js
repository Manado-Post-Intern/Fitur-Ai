import {Alert, Pressable, Share, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {
  IcLove,
  IcLoveBig,
  IcShare,
  IcShareBig,
  IcWhatsapp,
  IcWhatsappBig,
  theme,
} from '../../../assets';
import {Gap, TextInter} from '../../atoms';
import {share, whatsappShare} from '../../../utils/share';

const Actions = ({type, border = true, item}) => {
  const [containerWidth, setContainerWidth] = useState();

  const checkSlimContainer = () => {
    return containerWidth < 170;
  };

  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       message:
  //         'React Native | A framework for building native apps using React',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     Alert(error.message);
  //   }
  // };

  switch (type) {
    case 'big':
      return (
        <View style={[styles.container, border && styles.borderTop]}>
          {/* <Pressable style={styles.buttonContainer}>
            <IcLoveBig />
            <Gap width={4} />
            <TextInter style={styles.labelBig}>366k</TextInter>
          </Pressable> */}
          <Pressable
            onPress={() => share(item?.title, item?.url)}
            style={styles.buttonContainer}>
            <IcShareBig />
            <Gap width={4} />
            <TextInter style={styles.labelBig}>Share</TextInter>
          </Pressable>
          <Pressable
            onPress={() => whatsappShare(item?.title, item?.url)}
            style={styles.buttonContainer}>
            <IcWhatsappBig />
            <Gap width={4} />
            <TextInter style={styles.labelBig}>WhatsApp</TextInter>
          </Pressable>
        </View>
      );
    default:
      return (
        <View
          style={[styles.container, border && styles.borderTop]}
          onLayout={event => {
            var {width} = event.nativeEvent.layout;
            setContainerWidth(width);
          }}>
          {/* <Pressable
            style={[
              styles.buttonContainer,
              checkSlimContainer() && styles.slimButtonContainer,
            ]}>
            <IcLove />
            <Gap width={4} />
            <TextInter
              style={[styles.label, checkSlimContainer() && styles.labelSmall]}>
              367k
            </TextInter>
          </Pressable> */}
          <Pressable
            onPress={() => share(item.title, item.url)}
            style={[
              styles.buttonContainer,
              checkSlimContainer() && styles.slimButtonContainer,
            ]}>
            <IcShare />
            <Gap width={4} />
            <TextInter
              style={[styles.label, checkSlimContainer() && styles.labelSmall]}>
              Share
            </TextInter>
          </Pressable>
          <Pressable
            onPress={() => whatsappShare(item.title, item.url)}
            style={[
              styles.buttonContainer,
              checkSlimContainer() && styles.slimButtonContainer,
            ]}>
            <IcWhatsapp />
            <Gap width={4} />
            <TextInter
              style={[styles.label, checkSlimContainer() && styles.labelSmall]}>
              WhatsApp
            </TextInter>
          </Pressable>
        </View>
      );
  }
};

export default Actions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    paddingTop: 5,
    width: '100%',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.MPWhite,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  slimButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 10,
    color: theme.colors.MPGrey3,
  },
  labelBig: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 16,
    color: theme.colors.MPGrey3,
  },
  labelSmall: {
    fontFamily: theme.fonts.inter.semiBold,
    fontSize: 8,
    color: theme.colors.MPGrey3,
  },
});
