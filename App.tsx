import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {FoodHomeScreen} from './screens/FoodHomeScreen';
import {PlaceHomeScreen} from './screens/PlaceHomeScreen';
import {SettingScreen} from './screens/SettingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserScreen} from './screens/UserScreen';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import LoginScreen from './screens/LoginScreen';
import {FoodDetailsScreen} from './screens/FoodDetailsScreen';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FoodSearchScreen} from './screens/FoodSearchScreen';
import {PlaceSearchScreen} from './screens/PlaceSearchScreen';
import {PlaceDetailsScreen} from './screens/PlaceDetailsScreen';
import {Icon, Searchbar, Text} from 'react-native-paper';
import {UserManager} from './data/UserManager';

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

const TabM = createMaterialBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const FoodStack = createNativeStackNavigator<FoodStackParamList>();
const PlaceStack = createNativeStackNavigator<PlaceStackParamList>();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  useEffect(() => {
    UserManager.subscribe(setUser);
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabM.Navigator>
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
    </SettingsStack.Navigator>
  );
};

const FoodStackScreen = () => {
  const [query, setQuery] = useState('');

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
        headerTitle: props => (
          <Searchbar
            style={style.searchBar}
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
    backgroundColor: 'azure',
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
  bottomNavItem: {
    alignItems: 'center',
  },
  bottomNavItemImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  bottomNavItemTitle: {
    color: 'white',
  },
});

export default App;
