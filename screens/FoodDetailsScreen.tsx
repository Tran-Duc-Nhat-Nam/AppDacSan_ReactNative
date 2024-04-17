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
import Modal from 'react-native-modal';
import {FoodStackParamList, style} from '../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {DacSan} from '../models/DacSan';
import {useEffect, useState} from 'react';
import {Button, Chip, TextInput} from 'react-native-paper';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {UserManager} from '../data/UserManager';
import {NguoiDung} from '../models/NguoiDung';
import {
  LuotDanhGiaDacSan,
  LuotDanhGiaDacSanUI,
} from '../models/LuotDanhGiaDacSan';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import ViewMoreText from 'react-native-view-more-text';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const FoodDetailsScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute();
  const {itemId} = route.params;
  const [nd, setND] = useState<LuotDanhGiaDacSanUI[]>([]);
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [isMoTaExpand, setMoTaExpand] = useState(false);
  const [isCachCheBienExpand, CachCheBienExpand] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [ds, setDS] = useState<DacSan>();

  useEffect(() => {
    getDSFromApi();
  }, []);

  const getDSFromApi = async () => {
    try {
      const response = await fetch(
        'https://dacsanimage-b5os5eg63q-de.a.run.app/dacsan/' + itemId,
      );
      const json = await response.json();
      setDS(json);
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
        <Text style={style.header}>{ds ? ds.ten : ''}</Text>
        <View style={{height: 8}} />
        <Image
          source={{uri: ds!.hinh_dai_dien.url}}
          alt={ds!.hinh_dai_dien.ten}
          style={foodDetailsStyle.thumbnail}
        />
        <View style={{height: 8}} />
        <View
          style={[
            foodDetailsStyle.section,
            {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
          ]}>
          <Stat number={ds!.luot_xem} title="Lượt xem" />
          <Stat number={ds!.luot_danh_gia} title="Lượt đánh giá" />
          <Stat number={ds!.diem_danh_gia} title="Điểm trung bình" />
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Mô tả</Text>
          <SectionTextBody title={ds!.mo_ta} numberOfLines={4} />
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Cách chế biến</Text>
          <SectionTextBody title={ds!.cach_che_bien} numberOfLines={4} />
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Vùng miền</Text>
          <FlatList
            scrollEnabled={false}
            style={foodDetailsStyle.sectionBody}
            data={ds!.vung_mien}
            ItemSeparatorComponent={() => {
              return <View style={{height: 10}}></View>;
            }}
            renderItem={({item}) => {
              return (
                <Chip icon="information" onPress={() => console.log('Pressed')}>
                  {item.ten}
                </Chip>
              );
            }}></FlatList>
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Mùa</Text>
          <FlatList
            scrollEnabled={false}
            style={foodDetailsStyle.sectionBody}
            data={ds!.mua_dac_san}
            ItemSeparatorComponent={() => {
              return <View style={{height: 10}}></View>;
            }}
            renderItem={({item}) => {
              return (
                <Chip
                  icon="information"
                  onPress={() =>
                    props.navigation.navigate('Trang chủ đặc sản')
                  }>
                  {item.ten}
                </Chip>
              );
            }}></FlatList>
        </View>
        <View style={foodDetailsStyle.section}>
          <Text style={foodDetailsStyle.sectionHeader}>Nguyên liệu</Text>
          <FlatList
            scrollEnabled={false}
            style={foodDetailsStyle.sectionBody}
            data={ds!.thanh_phan}
            renderItem={({item}) => {
              return (
                <Text>
                  - {item.so_luong} {item.don_vi_tinh} {item.nguyen_lieu.ten}
                </Text>
              );
            }}></FlatList>
        </View>
        <Button
          children={<Text>Xem nhận xét về đặc sản</Text>}
          onPress={() => {
            UserManager.getUserReview(itemId, setND);
            setCommentVisible(true);
          }}
        />
        <Modal
          onBackdropPress={() => setCommentVisible(false)}
          isVisible={isCommentVisible}
          children={
            <FlatList
              scrollEnabled={false}
              style={foodDetailsStyle.commentSection}
              data={nd}
              renderItem={({item}) => {
                return item.is_placeholder ? (
                  <View style={foodDetailsStyle.section}>
                    <Text style={foodDetailsStyle.sectionHeader}>
                      Đánh giá của bạn
                    </Text>
                    <TextInput style={foodDetailsStyle.sectionBody} />
                  </View>
                ) : (
                  <View style={foodDetailsStyle.section}>
                    <Text style={foodDetailsStyle.sectionHeader}>
                      {item.ten_nguoi_dung}
                    </Text>
                    <Text style={foodDetailsStyle.sectionBody}>
                      {item.luot_danh_gia!.diem_danh_gia}
                    </Text>
                  </View>
                );
              }}
            />
          }
        />
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

export type SectionTextBodyProps = {
  title: string;
  numberOfLines: number;
};

export const SectionTextBody = (props: SectionTextBodyProps) => (
  <ViewMoreText
    textStyle={foodDetailsStyle.sectionBody}
    renderViewLess={onPress => <ViewButton onPress={onPress} title="Thu nhỏ" />}
    renderViewMore={onPress => <ViewButton onPress={onPress} title="Mở rộng" />}
    numberOfLines={props.numberOfLines}>
    {props.title}
  </ViewMoreText>
);

export type ViewButtonProps = {
  onPress: () => void;
  title: string;
};

export const ViewButton = (props: ViewButtonProps) => (
  <Text style={foodDetailsStyle.viewButton} onPress={props.onPress}>
    {props.title}
  </Text>
);

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
  viewButton: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'royalblue',
  },
  commentBackground: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  commentSection: {
    width: '80%',
    marginTop: 35,
    marginBottom: 35,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
  },
  stat: {
    margin: 5,
    alignItems: 'center',
  },
});
