import {
  useColorScheme,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import {style} from '../App';
import {useRoute} from '@react-navigation/native';
import {DacSan} from '../models/DacSan';
import {useEffect, useState} from 'react';
import {Chip} from 'react-native-paper';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NoiBan} from '../models/NoiBan';
import {SectionTextBody} from './FoodDetailsScreen';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const PlaceDetailsScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute();
  const {itemId} = route.params;

  const [isLoading, setLoading] = useState(true);
  const [nb, setNB] = useState<NoiBan>();

  useEffect(() => {
    getDSFromApi();
  }, []);

  const getDSFromApi = async () => {
    try {
      const response = await fetch(
        'https://dacsanimage-b5os5eg63q-de.a.run.app/noiban/' + itemId,
      );
      const json = await response.json();
      setNB(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <SafeAreaProvider>
      <ScrollView
        style={{
          backgroundColor: isDarkMode ? 'gold' : 'azure',
          flex: 1,
        }}>
        <Text style={style.header}>{nb ? nb.ten : ''}</Text>
        <View style={{height: 8}} />
        <View style={{height: 8}} />
        <View
          style={[
            foodDetailsStyle.section,
            {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
          ]}>
          <Stat number={nb!.luot_xem} title="Lượt xem" />
          <Stat number={nb!.luot_danh_gia} title="Lượt đánh giá" />
          <Stat number={nb!.diem_danh_gia} title="Điểm trung bình" />
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Mô tả</Text>
          <SectionTextBody title={nb!.mo_ta} numberOfLines={4} />
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Cách chế biến</Text>
          <SectionTextBody
            title={
              nb!.dia_chi.so_nha +
              ' ' +
              nb!.dia_chi.ten_duong +
              ', ' +
              nb!.dia_chi.phuong_xa.ten +
              ', ' +
              nb!.dia_chi.phuong_xa.quan_huyen.ten +
              ', ' +
              nb!.dia_chi.phuong_xa.quan_huyen.tinh_thanh.ten
            }
            numberOfLines={4}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

type StatProps = {
  number: number;
  title: string;
};

const Stat = (props: StatProps) => {
  return (
    <View style={foodDetailsStyle.stat}>
      <Text>{props.number}</Text>
      <Text>{props.title}</Text>
    </View>
  );
};

const foodDetailsStyle = StyleSheet.create({
  thumbnail: {
    aspectRatio: 3 / 2,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  section: {
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#A5C8FF',
  },
  sectionHeader: {
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: 10,
    color: 'white',
    backgroundColor: 'dodgerblue',
  },
  sectionBody: {
    padding: 10,
  },
  stat: {
    margin: 5,
    alignItems: 'center',
  },
});
