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
import {style} from '../App';
import {useEffect, useState} from 'react';
import {VungMien} from '../models/VungMien';
import {DacSan} from '../models/DacSan';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {NoiBan} from '../models/NoiBan';

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

export const PlaceSearchScreen = (props: SearchScreenProps) => {
  const [isLoading, setLoading] = useState(true);
  const [isEnd, setEnd] = useState(false);
  const [page, setPage] = useState(0);
  const [nb, setNB] = useState<NoiBan[]>([]);
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
          'https://dacsanimage-b5os5eg63q-de.a.run.app/noiban/ten=' +
            query +
            '/size=' +
            size +
            '/index=' +
            page,
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
      <Text style={style.header}>Kết quả tìm kiếm của từ khóa "{query}"</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => getVMFromApi(query, 5)}
        onEndReached={() => getVMFromApi(query, 5)}
        style={{
          backgroundColor: 'azure',
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
        props.navigation.navigate('Chi tiết đặc sản', {itemId: props.nb.id});
      }}>
      <View
        style={[
          {backgroundColor: isDarkMode ? 'gray' : 'skyblue'},
          foodStyle.item,
        ]}>
        <View style={foodStyle.itemInfo}>
          <Text numberOfLines={1}>{props.nb.ten}</Text>
          <View style={{height: 3}} />
          <View style={foodStyle.itemReview}>
            <Text>{props.nb.diem_danh_gia}</Text>
            <Image
              source={require('../assets/star.png')}
              style={foodStyle.itemReviewImage}
            />
          </View>
          <View style={{height: 3}} />
          <Text numberOfLines={2}>{props.nb.mo_ta}</Text>
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
