import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {IcChevronLeft, IcEdit, theme} from '../../assets';
import {screenHeightPercentage} from '../../utils';
import {Button, ChevroletBackButton, Gap, TextInter} from '../../components';
import {TextInput} from './components';
import {AuthContext} from '../../context/AuthContext';
import ImageCropPicker from 'react-native-image-crop-picker';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const Profile = () => {
  const {mpUser} = useContext(AuthContext);
  // EDIT ONLY ALLOWED FOR THIS PAYLOAD
  const [newPayload, setNewPayload] = useState({
    photo: mpUser?.photo,
    ktpUri: mpUser?.ktpUri,
    phoneNumber: mpUser?.phoneNumber?.replace(/^(?:\+62|62|0)/, ''),
  });

  const handleImageUpload = async uri => {
    const fileName = uri.split('/').pop();
    const photoRef = storage().ref(`/images/users/${mpUser?.uid}/${fileName}`);
    try {
      await photoRef.putFile(uri);
      return await photoRef.getDownloadURL();
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleImageSelect = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
      });
      return res.path;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const userRef = database().ref(`/users/${mpUser?.uid}/`);
    try {
      let payload = {...newPayload};
      if (payload?.photo !== mpUser?.photo) {
        const photUri = await handleImageUpload(newPayload?.photo);
        payload.photo = photUri;
      }
      if (payload?.ktpUri !== mpUser?.ktpUri) {
        const ktpUri = await handleImageUpload(newPayload?.ktpUri);
        payload.ktpUri = ktpUri;
      }

      payload.phoneNumber = `+62${payload.phoneNumber}`;

      // save to database
      await userRef.update(payload);
      if (Platform.OS === 'android')
        ToastAndroid.show('Data berhasil disimpan', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ChevroletBackButton />
        <TextInter style={styles.headerLabel}>Edit Profile</TextInter>
        <View style={styles.none}>
          <IcChevronLeft />
        </View>
      </View>

      <Gap height={33} />

      <View style={styles.profilePictureSection}>
        <Image style={styles.image} source={{uri: newPayload?.photo}} />
        <Pressable
          style={styles.editButton}
          onPress={() =>
            handleImageSelect().then(res => {
              if (res) {
                setNewPayload({...newPayload, photo: res});
              }
            })
          }>
          <IcEdit />
        </Pressable>
      </View>

      <View style={styles.inputSection}>
        <TextInput label="Nama" value={mpUser?.fullName} editable={false} />
        <TextInput label="Email" value={mpUser?.email} editable={false} />
        <TextInput
          editable={false}
          label="Nomor HP"
          value={newPayload?.phoneNumber}
          setValue={value => setNewPayload({...newPayload, phoneNumber: value})}
        />
        {/* <Password
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
        /> */}
        <KtpField
          user={newPayload}
          onPress={() =>
            handleImageSelect().then(res => {
              if (res) {
                setNewPayload({...newPayload, ktpUri: res});
              }
            })
          }
        />
      </View>
      <View style={styles.saveButtonContainer}>
        <Button label="Simpan" onPress={handleSave} />
      </View>
    </View>
  );
};

const KtpField = ({user, onPress}) => {
  return (
    <View>
      <TextInter style={styles.label}>
        KTP{' '}
        <TextInter style={[styles.label, {color: theme.colors.errorRed}]}>
          *dipelukan jika ingin menulis berita
        </TextInter>
      </TextInter>
      <Gap height={4} />
      <View
        style={{
          backgroundColor: theme.colors.white2,
          height: 150,
          borderRadius: 10,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: user?.ktpUri}}
          style={{resizeMode: 'contain', width: '100%', height: '100%'}}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: theme.colors.MPWhite,
            position: 'absolute',
            padding: 5,
            borderRadius: 7,
          }}>
          <Text style={{color: 'black'}}>Chose</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 38,
    paddingTop: screenHeightPercentage('5%'),
    flex: 1,
  },
  none: {
    opacity: 0,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: theme.colors.MPGrey2,
    fontWeight: '700',
  },

  profilePictureSection: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 100,
  },
  editButton: {
    width: 26,
    height: 26,
    backgroundColor: theme.colors.MPGrey2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    top: -14,
  },

  inputSection: {
    flex: 1,
  },
  saveButtonContainer: {
    bottom: screenHeightPercentage('5%'),
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.inter.regular,
    color: theme.colors.grey1,
  },
});
