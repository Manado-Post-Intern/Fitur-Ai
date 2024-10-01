import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../../src/context/AuthContext';

const LoginWill = ({navigation}) => {
  const {mpUser} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      if (user.email === 'pedagangwil@gmail.com') {
        console.log('Admin logged in:', user);
        console.log('Navigation:', navigation);
        navigation.navigate('PrivateRoutes', {screen: 'HomeTab'});
      } else {
        Alert.alert('Access Denied', 'You do not have admin privileges.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Login failure', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity activeOpacity={0.5} onPress={handleAdminLogin}>
        <View style={styles.buttonContainer}>
          <Text style={styles.textStyle}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#3CD3E4',
  },
  title: {
    fontSize: 24,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F7F2F2',
    borderRadius: 10,
  },
  buttonContainer: {
    width: 280,
    height: 39,
    backgroundColor: '#13274A',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 15,
    color: 'white',
  },
});
export default LoginWill;
