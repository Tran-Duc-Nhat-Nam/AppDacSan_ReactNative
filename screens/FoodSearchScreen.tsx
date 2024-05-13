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
import {url} from '../data/UserManager';

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

export const FoodSearchScreen = (props: SearchScreenProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setLoading] = useState(true);
  const [isEnd, setEnd] = useState(false);
  const [page, setPage] = useState(0);
  const [ds, setDS] = useState<DacSan[]>([]);
  const route = useRoute();
  var {query} = route.params;

  useEffect(() => {
    getVMFromApi(query, 5);
  }, []);

  const getVMFromApi = async (query: string, size: number) => {
    try {
      if (!isEnd) {
        setLoading(true);
        const response = await fetch(
          url + 'dacsan/ten=' + query + '/size=' + size + '/index=' + page,
        );
        const json = await response.json();
        if (json.length > 0) {
          setDS([...ds, ...json]);
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
          },
        ]}>
        Kết quả tìm kiếm của từ khóa "{query}"
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => getVMFromApi(query, 5)}
        onEndReached={() => getVMFromApi(query, 5)}
        style={{
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : lightTheme.colors.background,
          height: '96%',
        }}
        data={ds}
        renderItem={({item}) => (
          <FoodItem ds={item} navigation={props.navigation} />
        )}
      />
    </SafeAreaProvider>
  );
};

type DSProps = {
  navigation: NativeStackNavigationProp<any, any>;
  ds: DacSan;
};

const FoodItem = (props: DSProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Chi tiết đặc sản', {itemId: props.ds.id});
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
        <Image
          source={{uri: props.ds.hinh_dai_dien.url}}
          alt={props.ds.hinh_dai_dien.ten}
          defaultSource={require('../assets/food.png')}
          style={foodStyle.itemImage}
          width={80}
          height={80}
        />
        <View style={foodStyle.itemInfo}>
          <Text numberOfLines={1}>{props.ds.ten}</Text>
          <View style={{height: 3}} />
          <View style={foodStyle.itemReview}>
            <Text>{props.ds.diem_danh_gia}</Text>
            <Image
              source={require('../assets/star.png')}
              style={foodStyle.itemReviewImage}
            />
          </View>
          <View style={{height: 3}} />
          <Text numberOfLines={2}>{props.ds.mo_ta}</Text>
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
    marginTop: 18,
    marginBottom: 0,
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
