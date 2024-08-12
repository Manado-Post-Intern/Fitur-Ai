import {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment/moment';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [mpUser, setMpUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber;
  }, []);

  useEffect(() => {
    if (user) {
      const ref = database().ref(`users/${user.uid}/`);
      ref.on('value', snapshot => {
        if (snapshot.child('subscription').exists()) {
          const {purchaseDate, expireDate} = snapshot
            .child('subscription')
            .val();
          const isExpired = !moment().isBetween(purchaseDate, expireDate);
          if (isExpired) {
            database().ref(`users/${user.uid}/subscription`).update({
              isExpired,
            });
          }
        }
        setMpUser(snapshot.val());
      });
    }
  }, [user]);

  if (initializing) return null;

  return (
    <AuthContext.Provider value={{user, mpUser}}>
      {children}
    </AuthContext.Provider>
  );
};
