import {
  useColorScheme,
  SafeAreaView,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacityBase,
  TouchableOpacity,
} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {style} from '../App';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const SettingScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider
      style={{backgroundColor: isDarkMode ? 'gold' : 'azure', flex: 1}}>
      <Text style={style.header}>Cài đặt</Text>
      <TouchableOpacity onPress={() => props.navigation.navigate('Người dùng')}>
        <Text style={{fontWeight: 'bold', padding: 15}}>Người dùng</Text>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
      <Text style={{textAlign: 'center', padding: 10}}>Vinafood - 2024</Text>
    </SafeAreaProvider>
  );
};
