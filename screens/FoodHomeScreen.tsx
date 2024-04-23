import {
  useColorScheme,
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {darkTheme, lightTheme, style} from '../App';
import {useEffect, useState} from 'react';
import {VungMien} from '../models/VungMien';
import {DacSan} from '../models/DacSan';
import {DefaultTheme, Searchbar, TextInput} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Icon} from 'react-native-paper';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

export const FoodHomeScreen = (props: HomeScreenProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setLoading] = useState(true);
  const [vm, setVM] = useState<VungMien[]>([]);

  useEffect(() => {
    getVMFromApi();
  }, []);

  const getVMFromApi = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://dacsanimage-b5os5eg63q-de.a.run.app/vungmien/',
      );
      const json = await response.json();
      setVM(json);
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
        Đặc sản
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {
          getVMFromApi();
        }}
        style={{
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : DefaultTheme.colors.background,
          height: '96%',
        }}
        data={vm}
        renderItem={({item}) => (
          <FoodRow vm={item} navigation={props.navigation} />
        )}
      />
    </SafeAreaProvider>
  );
};

type VMProps = {
  navigation: NativeStackNavigationProp<any, any>;
  vm: VungMien;
};

const FoodRow = (props: VMProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  const [ds, setDS] = useState<DacSan[]>([]);

  useEffect(() => {
    getDSFromApi();
  }, []);

  const getDSFromApi = async () => {
    try {
      const response = await fetch(
        'https://dacsanimage-b5os5eg63q-de.a.run.app/dacsan/vungmien=' +
          props.vm.id +
          '/size=5/index=0',
      );
      const json = await response.json();
      setDS(json);
    } catch (error) {
      console.error(error);
    }
  };

  return ds.length == 0 ? (
    <></>
  ) : (
    <View
      style={[
        {
          backgroundColor: isDarkMode
            ? darkTheme.colors.secondaryContainer
            : lightTheme.colors.secondaryContainer,
        },
        foodStyle.container,
      ]}>
      <Text
        style={[
          {
            backgroundColor: isDarkMode
              ? darkTheme.colors.primaryContainer
              : lightTheme.colors.secondary,
            color: isDarkMode
              ? darkTheme.colors.onPrimaryContainer
              : lightTheme.colors.onSecondary,
          },
          foodStyle.containerHeader,
        ]}
        numberOfLines={1}>
        {props.vm.ten}
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ds}
        renderItem={({item}) => (
          <FoodItem ds={item} navigation={props.navigation} />
        )}
      />
    </View>
  );
};

type DSProps = {
  navigation: NativeStackNavigationProp<any, any>;
  ds: DacSan;
};

const FoodItem = (props: DSProps) => {
  var isDarkMode = useColorScheme() === 'dark';
  const [src, setSrc] = useState<ImageSourcePropType>({
    uri: props.ds.hinh_dai_dien.url,
  });
  Image.prefetch(props.ds.hinh_dai_dien.url).catch(error =>
    setSrc(require('../assets/food.png')),
  );
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Chi tiết đặc sản', {itemId: props.ds.id});
      }}>
      <View style={foodStyle.item}>
        <Image
          source={src}
          alt={props.ds.hinh_dai_dien.ten}
          style={foodStyle.itemImage}
          width={80}
          height={80}
        />
        <Text
          style={[
            foodStyle.itemTitle,
            {
              color: isDarkMode
                ? darkTheme.colors.onSecondaryContainer
                : lightTheme.colors.onSecondaryContainer,
            },
          ]}
          numberOfLines={1}>
          {props.ds.ten}
        </Text>
        <View style={foodStyle.itemReview}>
          <Text
            style={{
              color: isDarkMode
                ? darkTheme.colors.onSecondaryContainer
                : lightTheme.colors.onSecondaryContainer,
            }}>
            {props.ds.diem_danh_gia}
          </Text>
          <Image
            source={require('../assets/star.png')}
            style={foodStyle.itemReviewImage}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const foodStyle = StyleSheet.create({
  container: {
    height: 170,
    margin: 10,
    borderRadius: 10,
  },
  containerHeader: {
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: 10,
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  item: {
    height: 135,
    width: 100,
    padding: 5,
    marginTop: 4,
    alignItems: 'center',
  },
  itemTitle: {
    marginTop: 5,
    marginBottom: 3,
  },
  itemImage: {
    borderRadius: 10,
    height: 80,
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
