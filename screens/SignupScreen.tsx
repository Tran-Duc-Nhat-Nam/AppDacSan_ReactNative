import React, {useMemo, useState} from 'react';
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
import {Icon, RadioButton} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {NguoiDung} from '../models/NguoiDung';

export const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [male, setMale] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [isHide, setHide] = useState(true);
  var isDarkMode = useColorScheme() === 'dark';

  const radioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Nam',
        value: 'true',
      },
      {
        id: '2',
        label: 'Nữ',
        value: 'false',
      },
    ],
    [],
  );

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
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
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
      <TextInput
        style={loginStyle.input}
        placeholder="Tên người dùng"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={loginStyle.input}
        placeholder="Số điện thoại"
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <Pressable style={loginStyle.input} onPress={() => setOpen(true)}>
        <Text>Ngày sinh: {date.toLocaleDateString()}</Text>
      </Pressable>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={value => setMale(value == '1')}
        selectedId={male === true ? '1' : '2'}
        layout={'row'}
        containerStyle={loginStyle.genderRadioGroup}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Pressable
        style={loginStyle.signupButton}
        onPress={() => {
          var temp: NguoiDung = {
            id: '-1',
            email: email,
            ten: username,
            ngay_sinh: date,
            so_dien_thoai: phoneNumber,
            dia_chi: {
              so_nha: '1',
              ten_duong: 'Đường không tên',
              id: 999,
              phuong_xa: {
                id: 8989,
                ten: 'Thị trấn Quang Minh',
                quan_huyen: {
                  id: 250,
                  ten: 'Huyện Mê Linh',
                  tinh_thanh: {id: 1, ten: 'Hà Nội'},
                },
              },
            },
          };
          UserManager.signup(email, password, temp);
        }}>
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
  genderRadioGroup: {
    marginTop: 15,
    justifyContent: 'space-evenly',
  },
});
