// import { Share } from "react-native"
import Share from 'react-native-share';

export const whatsappShare = async (message, url) => {
  try {
    const ShareResponse = await Share.shareSingle({
      title: 'Share via WhatsApp',
      message: message,
      social: Share.Social.WHATSAPP,
      url: url,
    });
    console.log('Share Response', ShareResponse);
  } catch (error) {
    console.log('Error', error);
  }
};

export const share = async (message, url) => {
  try {
    const ShareResponse = await Share.open({
      title: 'Share',
      message: message,
      url: url,
    });
    console.log('Share Response', ShareResponse);
  } catch (error) {
    console.log('Error', error);
  }
};
