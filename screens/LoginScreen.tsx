import React, {useState} from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import {darkTheme, lightTheme, style} from '../App';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserManager} from '../data/UserManager';
import {DefaultTheme, Icon} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

export const LoginScreen = (props: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHide, setHide] = useState(true);
  var isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider
      style={[
        {
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : lightTheme.colors.background,
          justifyContent: 'center',
        },
        style.container,
      ]}>
      <TextInput
        style={loginStyle.input}
        placeholder="Tên tài khoản"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <View style={loginStyle.input}>
        <TextInput
          style={loginStyle.inputField}
          placeholder="Mật khẩu"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={isHide}></TextInput>
        <TouchableWithoutFeedback onPress={() => setHide(!isHide)}>
          <Icon source={isHide ? 'eye-off' : 'eye'} size={30} />
        </TouchableWithoutFeedback>
      </View>
      <Pressable
        style={loginStyle.loginButton}
        onPress={() => UserManager.login(username, password)}>
        <Text style={loginStyle.loginButtonText}>Đăng nhập</Text>
      </Pressable>
      <Pressable
        style={loginStyle.signupButton}
        onPress={() => props.navigation.navigate('Đăng ký')}>
        <Text style={loginStyle.loginButtonText}>Đăng ký</Text>
      </Pressable>
    </SafeAreaProvider>
  );
};

const loginStyle = StyleSheet.create({
  input: {
    height: 50,
    marginTop: 15,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
  },
  loginButton: {
    height: 35,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupButton: {
    height: 35,
    margin: 15,
    borderRadius: 15,
    backgroundColor: 'orange',
    justifyContent: 'center',
  },
});
