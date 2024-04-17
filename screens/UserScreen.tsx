import {useColorScheme, SafeAreaView, Text, View, Button} from 'react-native';
import {style} from '../App';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useState, useEffect} from 'react';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserManager as UserManager} from '../data/UserManager';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const UserScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    UserManager.subscribe(setUser);
  }, []);

  return (
    <SafeAreaProvider
      style={{
        backgroundColor: isDarkMode ? 'gold' : 'azure',
        flex: 1,
      }}>
      <Text style={style.header}>Thông tin người dùng</Text>
      <Text style={{padding: 15}}>UID: {user?.uid}</Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text style={{padding: 15}}>Email: {user?.email}</Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Button
        color="tomato"
        title="Đăng xuất"
        onPress={() => {
          auth()
            .signOut()
            .then(() => {
              setUser(undefined);
              props.navigation.navigate('Người dùng');
            });
        }}
      />
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
    </SafeAreaProvider>
  );
};
