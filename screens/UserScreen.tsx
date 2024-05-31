import {useColorScheme, Text, View} from 'react-native';
import {darkTheme, lightTheme, style} from '../App';
import auth from '@react-native-firebase/auth';
import {useState, useEffect} from 'react';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserManager as UserManager} from '../data/UserManager';
import {NguoiDung} from '../models/NguoiDung';
import {Button} from 'react-native-paper';
import {format} from 'date-fns';
import DatePicker from 'react-native-date-picker';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const UserScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<NguoiDung>();

  useEffect(() => {
    UserManager.getUser(setUser);
  }, []);

  return (
    <SafeAreaProvider
      style={{
        backgroundColor: isDarkMode
          ? darkTheme.colors.background
          : lightTheme.colors.background,
        flex: 1,
      }}>
      <Text
        style={[
          style.header,
          {
            backgroundColor: isDarkMode
              ? darkTheme.colors.primaryContainer
              : lightTheme.colors.primary,
          },
        ]}>
        Thông tin người dùng
      </Text>
      <Text
        style={{
          padding: 15,
          color: isDarkMode
            ? darkTheme.colors.onBackground
            : lightTheme.colors.onBackground,
        }}>
        UID: {user?.id}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text
        style={{
          padding: 15,
          color: isDarkMode
            ? darkTheme.colors.onBackground
            : lightTheme.colors.onBackground,
        }}>
        Email: {user?.email}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text
        style={{
          padding: 15,
          color: isDarkMode
            ? darkTheme.colors.onBackground
            : lightTheme.colors.onBackground,
        }}>
        Tên: {user?.ten}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text
        style={{
          padding: 15,
          color: isDarkMode
            ? darkTheme.colors.onBackground
            : lightTheme.colors.onBackground,
        }}>
        Ngày sinh:{' '}
        {user?.ngay_sinh ? new Date(user?.ngay_sinh).toDateString() : ''}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text
        style={{
          padding: 15,
          color: isDarkMode
            ? darkTheme.colors.onBackground
            : lightTheme.colors.onBackground,
        }}>
        UID: {user?.id}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Button
        children={<Text style={{color: 'tomato'}}>Đăng xuất</Text>}
        onPress={() => {
          auth()
            .signOut()
            .then(() => {
              setUser(undefined);
              props.navigation.navigate('Người dùng');
            });
        }}
      />
    </SafeAreaProvider>
  );
};
