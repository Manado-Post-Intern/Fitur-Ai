import database from '@react-native-firebase/database';

export const checkUserPreferences = mpUser =>
  new Promise(async (resolve, reject) => {
    const userRef = database().ref(`/users/${mpUser.uid}`);
    try {
      await userRef.once('value', snapshot => {
        if (snapshot.child('preferences').exists()) {
          resolve(snapshot.child('preferences').val());
        } else {
          reject(new Error('User preferences not found'));
        }
      });
    } catch (error) {
      throw error;
    }
  });
