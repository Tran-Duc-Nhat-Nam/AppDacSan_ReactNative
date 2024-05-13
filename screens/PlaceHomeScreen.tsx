import {
  useColorScheme,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {darkTheme, lightTheme, style} from '../App';
import {useEffect, useState} from 'react';
import {VungMien} from '../models/VungMien';
import {DacSan} from '../models/DacSan';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {NoiBan} from '../models/NoiBan';
import {url} from '../data/UserManager';

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

export const PlaceHomeScreen = (props: SearchScreenProps) => {
  const [isLoading, setLoading] = useState(true);
  var isDarkMode = useColorScheme() === 'dark';
  const [isEnd, setEnd] = useState(false);
  const [page, setPage] = useState(0);
  const [nb, setNB] = useState<NoiBan[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getVMFromApi(10);
  }, []);

  const getVMFromApi = async (size: number) => {
    try {
      if (!isEnd) {
        setLoading(true);
        const response = await fetch(
          url + 'noiban/ten=/size=' + size + '/index=' + page,
        );
        const json = await response.json();
        if (json.length > 0) {
          setNB([...nb, ...json]);
          console.log('Load page ' + page);
          setPage(page + 1);
        } else {
          setEnd(true);
          console.log('End');
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <Text
        style={[
          style.header,
          {
            backgroundColor: isDarkMode
              ? darkTheme.colors.primaryContainer
              : lightTheme.colors.primary,
            color: isDarkMode
              ? darkTheme.colors.onPrimaryContainer
              : lightTheme.colors.onSecondary,
          },
        ]}>
        Đặc sản
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => getVMFromApi(10)}
        onEndReached={() => getVMFromApi(10)}
        onEndReachedThreshold={0.1}
        style={{
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : lightTheme.colors.background,
          height: '96%',
        }}
        data={nb}
        renderItem={({item}) => (
          <PlaceItem nb={item} navigation={props.navigation} />
        )}
      />
    </SafeAreaProvider>
  );
};

type NBProps = {
  navigation: NativeStackNavigationProp<any, any>;
  nb: NoiBan;
};

const PlaceItem = (props: NBProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Chi tiết nơi bán', {
          itemId: props.nb.id,
        });
      }}>
      <View
        style={[
          {
            backgroundColor: isDarkMode
              ? darkTheme.colors.secondaryContainer
              : lightTheme.colors.secondaryContainer,
          },
          foodStyle.item,
        ]}>
        <View style={foodStyle.itemInfo}>
          <Text
            numberOfLines={1}
            style={{
              color: isDarkMode
                ? darkTheme.colors.onSecondaryContainer
                : lightTheme.colors.onSecondaryContainer,
            }}>
            {props.nb.ten}
          </Text>
          <View style={{height: 3}} />
          <View style={foodStyle.itemReview}>
            <Text
              style={{
                color: isDarkMode
                  ? darkTheme.colors.onSecondaryContainer
                  : lightTheme.colors.onSecondaryContainer,
              }}>
              {props.nb.diem_danh_gia}
            </Text>
            <Image
              source={require('../assets/star.png')}
              style={foodStyle.itemReviewImage}
            />
          </View>
          <View style={{height: 3}} />
          <Text
            numberOfLines={2}
            style={{
              color: isDarkMode
                ? darkTheme.colors.onSecondaryContainer
                : lightTheme.colors.onSecondaryContainer,
            }}>
            {props.nb.mo_ta}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const foodStyle = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: 15,
    margin: 10,
    alignItems: 'center',
  },
  itemInfo: {
    padding: 8,
    flex: 1,
  },
  itemImage: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  itemReview: {
    flexDirection: 'row',
    paddingLeft: 5,
    width: '100%',
    alignItems: 'center',
  },
  itemReviewImage: {
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'cover',
  },
});
