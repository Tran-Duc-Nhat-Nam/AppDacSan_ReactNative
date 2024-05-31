import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {FoodHomeScreen} from './screens/FoodHomeScreen';
import {PlaceHomeScreen} from './screens/PlaceHomeScreen';
import {SettingScreen} from './screens/SettingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserScreen} from './screens/UserScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {LoginScreen} from './screens/LoginScreen';
import {FoodDetailsScreen} from './screens/FoodDetailsScreen';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FoodSearchScreen} from './screens/FoodSearchScreen';
import {PlaceSearchScreen} from './screens/PlaceSearchScreen';
import {PlaceDetailsScreen} from './screens/PlaceDetailsScreen';
import {
  DefaultTheme,
  Icon,
  PaperProvider,
  Searchbar,
  Text,
} from 'react-native-paper';
import {UserManager} from './data/UserManager';
import {SignupScreen} from './screens/SignupScreen';

export type FoodStackParamList = {
  'Trang chủ đặc sản': undefined;
  'Chi tiết đặc sản': {itemId: number};
  'Tìm kiếm đặc sản': {query: string};
};

export type PlaceStackParamList = {
  'Trang chủ nơi bán': undefined;
  'Chi tiết nơi bán': {itemId: number};
  'Tìm kiếm nơi bán': {query: string};
};

export const ColorList = {
  barColorDark: 'darkslategrey',
};

export const darkTheme = {
  colors: {
    primary: 'rgb(165, 200, 255)',
    onPrimary: 'rgb(0, 49, 95)',
    primaryContainer: 'rgb(0, 71, 134)',
    onPrimaryContainer: 'rgb(212, 227, 255)',
    secondary: 'rgb(129, 207, 255)',
    onSecondary: 'rgb(0, 52, 75)',
    secondaryContainer: 'rgb(0, 76, 107)',
    onSecondaryContainer: 'rgb(198, 231, 255)',
    tertiary: 'rgb(122, 208, 255)',
    onTertiary: 'rgb(0, 53, 73)',
    tertiaryContainer: 'rgb(0, 76, 105)',
    onTertiaryContainer: 'rgb(195, 232, 255)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(26, 28, 30)',
    onBackground: 'rgb(227, 226, 230)',
    surface: 'rgb(26, 28, 30)',
    onSurface: 'rgb(227, 226, 230)',
    surfaceVariant: 'rgb(67, 71, 78)',
    onSurfaceVariant: 'rgb(195, 198, 207)',
    outline: 'rgb(141, 145, 153)',
    outlineVariant: 'rgb(67, 71, 78)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(227, 226, 230)',
    inverseOnSurface: 'rgb(47, 48, 51)',
    inversePrimary: 'rgb(0, 95, 175)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(33, 37, 41)',
      level2: 'rgb(37, 42, 48)',
      level3: 'rgb(41, 47, 55)',
      level4: 'rgb(43, 49, 57)',
      level5: 'rgb(46, 52, 62)',
    },
    surfaceDisabled: 'rgba(227, 226, 230, 0.12)',
    onSurfaceDisabled: 'rgba(227, 226, 230, 0.38)',
    backdrop: 'rgba(45, 49, 56, 0.4)',
  },
};

export const lightTheme = {
  colors: {
    primary: 'rgb(0, 95, 175)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(212, 227, 255)',
    onPrimaryContainer: 'rgb(0, 28, 58)',
    secondary: 'rgb(0, 101, 140)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(198, 231, 255)',
    onSecondaryContainer: 'rgb(0, 30, 45)',
    tertiary: 'rgb(0, 102, 138)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(195, 232, 255)',
    onTertiaryContainer: 'rgb(0, 30, 44)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(253, 252, 255)',
    onBackground: 'rgb(26, 28, 30)',
    surface: 'rgb(253, 252, 255)',
    onSurface: 'rgb(26, 28, 30)',
    surfaceVariant: 'rgb(224, 226, 236)',
    onSurfaceVariant: 'rgb(67, 71, 78)',
    outline: 'rgb(116, 119, 127)',
    outlineVariant: 'rgb(195, 198, 207)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(47, 48, 51)',
    inverseOnSurface: 'rgb(241, 240, 244)',
    inversePrimary: 'rgb(165, 200, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(240, 244, 251)',
      level2: 'rgb(233, 239, 249)',
      level3: 'rgb(225, 235, 246)',
      level4: 'rgb(223, 233, 245)',
      level5: 'rgb(218, 230, 244)',
    },
    surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
    backdrop: 'rgba(45, 49, 56, 0.4)',
  },
};

const TabM = createMaterialBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const FoodStack = createNativeStackNavigator<FoodStackParamList>();
const PlaceStack = createNativeStackNavigator<PlaceStackParamList>();

const App = () => {
  var isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  useEffect(() => {
    UserManager.subscribe(setUser);
  }, []);
  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabM.Navigator theme={isDarkMode ? darkTheme : DefaultTheme}>
            <TabM.Screen
              name="Đặc sản"
              component={FoodStackScreen}
              options={{
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="food" color={color} size={26} />
                ),
              }}></TabM.Screen>
            <TabM.Screen
              name="Nơi bán"
              component={PlaceStackScreen}
              options={{
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}></TabM.Screen>
            <TabM.Screen
              name="Cài đặt"
              component={SettingsStackScreen}
              options={{
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="account"
                    color={color}
                    size={26}
                  />
                ),
              }}></TabM.Screen>
          </TabM.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const SettingsStackScreen = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log(user.uid);
      } else {
        setUser(undefined);
        console.log('No user');
      }
    });
    return subscriber;
  }, []);

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="Cài đặt chính" component={SettingScreen} />
      <SettingsStack.Screen
        name="Người dùng"
        component={user ? UserScreen : LoginScreen}
      />
      <SettingsStack.Screen
        name="Đăng ký"
        component={user ? FoodHomeScreen : SignupScreen}
      />
    </SettingsStack.Navigator>
  );
};

const FoodStackScreen = () => {
  const [query, setQuery] = useState('');
  var isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log(user.uid);
      } else {
        console.log('No user');
      }
    });
    return subscriber;
  }, []);

  return (
    <FoodStack.Navigator
      initialRouteName="Trang chủ đặc sản"
      screenOptions={({navigation, route}) => ({
        headerStyle: {
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : lightTheme.colors.background,
        },
        headerTitle: props => (
          <Searchbar
            theme={isDarkMode ? darkTheme : DefaultTheme}
            style={[style.searchBar]}
            placeholder={'Tìm kiếm đặc sản'}
            onChangeText={text => {
              setQuery(text);
            }}
            value={query}
            onSubmitEditing={() => {
              navigation.navigate('Tìm kiếm đặc sản', {query: query});
            }}
          />
        ),
        headerBackVisible: false,
        headerLeft: props => {
          return props.canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon size={25} source={'arrow-left'} />
            </TouchableOpacity>
          ) : (
            <></>
          );
        },
      })}>
      <FoodStack.Screen name="Trang chủ đặc sản" component={FoodHomeScreen} />
      <FoodStack.Screen name="Tìm kiếm đặc sản" component={FoodSearchScreen} />
      <FoodStack.Screen name="Chi tiết đặc sản" component={FoodDetailsScreen} />
    </FoodStack.Navigator>
  );
};

const PlaceStackScreen = () => {
  const [query, setQuery] = useState('');
  var isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log(user.uid);
      } else {
        console.log('No user');
      }
    });
    return subscriber;
  }, []);

  return (
    <PlaceStack.Navigator
      initialRouteName="Trang chủ nơi bán"
      screenOptions={({navigation, route}) => ({
        headerStyle: {
          backgroundColor: isDarkMode ? darkTheme.colors.background : 'white',
        },
        headerTitle: props => (
          <Searchbar
            style={style.searchBar}
            placeholder={'Tìm kiếm nơi bán'}
            onChangeText={text => {
              setQuery(text);
            }}
            value={query}
            onSubmitEditing={() => {
              navigation.navigate('Tìm kiếm nơi bán', {query: query});
            }}
          />
        ),
        headerBackVisible: false,
        headerLeft: props => {
          return props.canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon size={25} source={'arrow-left'} />
            </TouchableOpacity>
          ) : (
            <></>
          );
        },
      })}>
      <PlaceStack.Screen name="Trang chủ nơi bán" component={PlaceHomeScreen} />
      <PlaceStack.Screen
        name="Tìm kiếm nơi bán"
        component={PlaceSearchScreen}
      />
      <PlaceStack.Screen
        name="Chi tiết nơi bán"
        component={PlaceDetailsScreen}
      />
    </PlaceStack.Navigator>
  );
};

export const style = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
  },
  topNavBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
    paddingLeft: 15,
  },
  searchBar: {
    flex: 0.965,
    margin: 10,
  },
  searchIcon: {
    position: 'absolute',
  },
  avatar: {
    borderRadius: 50,
  },
  header: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 8,
    backgroundColor: 'deepskyblue',
  },
  bottomNavBar: {
    height: 75,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'dodgerblue',
  },
});

export default App;
