import {
  useColorScheme,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {style} from '../App';
import {useRoute} from '@react-navigation/native';
import {DacSan} from '../models/DacSan';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Chip, Icon, TextInput} from 'react-native-paper';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UserManager} from '../data/UserManager';
import {LuotDanhGiaDacSanUI} from '../models/LuotDanhGiaDacSan';
import ViewMoreText from 'react-native-view-more-text';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const FoodDetailsScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute();
  const {itemId} = route.params;
  const [nd, setND] = useState<LuotDanhGiaDacSanUI[]>([]);
  const [selfComment, setSelfComment] = useState<LuotDanhGiaDacSanUI>();
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);
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
          backgroundColor: isDarkMode ? 'black' : 'azure',
          flex: 1,
        }}>
        <Text style={style.header}>{ds ? ds.ten : ''}</Text>
        <View style={{height: 8}} />
        <Image
          source={{uri: ds!.hinh_dai_dien.url}}
          alt={ds!.hinh_dai_dien.ten}
          style={detailStyle.thumbnail}
        />
        <View style={{height: 8}} />
        <View
          style={[
            detailStyle.section,
            {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
          ]}>
          <Stat number={ds!.luot_xem} title="Lượt xem" />
          <Stat number={ds!.luot_danh_gia} title="Lượt đánh giá" />
          <Stat number={ds!.diem_danh_gia} title="Điểm trung bình" />
        </View>
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Mô tả</Text>
          <SectionTextBody title={ds!.mo_ta} numberOfLines={4} />
        </View>
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Cách chế biến</Text>
          <SectionTextBody title={ds!.cach_che_bien} numberOfLines={4} />
        </View>
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Vùng miền</Text>
          <FlatList
            scrollEnabled={false}
            style={detailStyle.sectionBody}
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
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Mùa</Text>
          <FlatList
            scrollEnabled={false}
            style={detailStyle.sectionBody}
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
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Nguyên liệu</Text>
          <FlatList
            scrollEnabled={false}
            style={detailStyle.sectionBody}
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
            UserManager.getReviews(itemId, setND);
            UserManager.getUserReview(itemId, setSelfComment);
            setCommentVisible(true);
          }}
        />
        <Modal
          style={{paddingVertical: 25}}
          onBackdropPress={() => setCommentVisible(false)}
          isVisible={isCommentVisible}
          children={
            <MenuProvider>
              <View style={detailStyle.commentSection}>
                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}>
                    Danh sách đánh giá
                  </Text>
                  <Text>{ds ? ds.diem_danh_gia : 0}</Text>
                  <Icon source={'star'} size={20} color="gold" />
                  <Text>/ {nd.length}</Text>
                  <Icon source={'account-edit'} size={20} />
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: 'gray',
                  }}
                />
                <FlatList
                  scrollEnabled={false}
                  data={nd}
                  renderItem={({item}) => {
                    return item.is_self ? (
                      <></>
                    ) : (
                      <View
                        style={{
                          backgroundColor: '#A5C8FF',
                          borderRadius: 5,
                          marginTop: 10,
                          marginHorizontal: 8,
                        }}>
                        <View
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            backgroundColor: 'dodgerblue',
                          }}>
                          <Text style={{flex: 1}}>{item.ten_nguoi_dung}</Text>
                          <Text>{item.luot_danh_gia!.diem_danh_gia}</Text>
                          <Icon source={'star-outline'} size={16} />
                        </View>
                        <Text style={detailStyle.sectionBody}>
                          {item.luot_danh_gia!.diem_danh_gia}
                        </Text>
                      </View>
                    );
                  }}
                />
                <View style={detailStyle.selfComment}>
                  {selfComment &&
                  selfComment.luot_danh_gia?.id_nguoi_dung &&
                  !selfComment.is_placeholder ? (
                    <View style={detailStyle.selfCommentBody}>
                      <View
                        style={{
                          paddingTop: 10,
                          paddingHorizontal: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={{flex: 1, fontWeight: 'bold'}}>
                          Đánh giá của bạn
                        </Text>
                        <Text style={{alignSelf: 'flex-end', marginRight: 3}}>
                          {selfComment!.luot_danh_gia!.diem_danh_gia}
                        </Text>
                        <Icon source={'star'} size={20} color="gold" />
                      </View>
                      <View
                        style={{
                          paddingVertical: 5,
                          paddingRight: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={[detailStyle.sectionBody, {flex: 1}]}>
                          {selfComment!.luot_danh_gia!.noi_dung.trim().length ==
                          0
                            ? '(Hãy thêm vào nội dung đánh giá)'
                            : selfComment!.luot_danh_gia!.noi_dung}
                        </Text>
                        <Menu>
                          <MenuTrigger>
                            <Icon source={'dots-vertical'} size={30} />
                          </MenuTrigger>
                          <MenuOptions>
                            <MenuOption
                              onSelect={() => {
                                if (selfComment.is_placeholder) {
                                } else {
                                  setRate(
                                    selfComment.luot_danh_gia!.diem_danh_gia,
                                  );
                                  setComment(
                                    selfComment.luot_danh_gia!.noi_dung,
                                  );
                                  setSelfComment({
                                    luot_danh_gia: selfComment.luot_danh_gia,
                                    ten_nguoi_dung: selfComment.ten_nguoi_dung,
                                    is_placeholder: true,
                                    is_self: true,
                                  });
                                }
                              }}
                              text="Chỉnh sửa"
                            />
                            <MenuOption
                              onSelect={() =>
                                UserManager.deleteReview(ds!.id, setSelfComment)
                              }>
                              <Text style={{color: 'red'}}>Xóa</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                    </View>
                  ) : (
                    <View style={detailStyle.selfCommentBody}>
                      <Text
                        style={{
                          padding: 10,
                          fontWeight: '600',
                        }}>
                        Hãy đánh giá về {ds?.ten}
                      </Text>
                      <Star currentIndex={rate} setState={setRate} />
                      <TextInput
                        style={{
                          height: 50,
                          borderRadius: 15,
                          margin: 8,
                          backgroundColor: '#A5C8FF',
                          borderWidth: 1,
                          borderColor: 'gray',
                        }}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={text => setComment(text)}
                        onSubmitEditing={() => {
                          UserManager.review(
                            {
                              id_dac_san: ds ? ds.id : -1,
                              id_nguoi_dung: '',
                              diem_danh_gia: rate,
                              noi_dung: comment,
                              thoi_gian_danh_gia: new Date(),
                            },
                            setSelfComment,
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </MenuProvider>
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
    <View style={detailStyle.stat}>
      <Text>{props.number}</Text>
      <Text>{props.title}</Text>
    </View>
  );
};

export type StarProps = {
  setState: Dispatch<SetStateAction<number>>;
  currentIndex: number;
};

export const Star = (props: StarProps) => {
  const stars: JSX.Element[] = [];
  for (let index = 1; index <= 5; index++) {
    stars.push(
      <TouchableWithoutFeedback
        onPress={() => props.setState(index)}
        key={index}>
        <View>
          <Icon
            source={props.currentIndex >= index ? 'star' : 'star-outline'}
            size={30}
            color={props.currentIndex >= index ? 'gold' : undefined}
          />
        </View>
      </TouchableWithoutFeedback>,
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-around',
      }}>
      {stars}
    </View>
  );
};

export type SectionTextBodyProps = {
  title: string;
  numberOfLines: number;
};

export const SectionTextBody = (props: SectionTextBodyProps) => (
  <ViewMoreText
    textStyle={detailStyle.sectionBody}
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
  <Text style={detailStyle.viewButton} onPress={props.onPress}>
    {props.title}
  </Text>
);

export const detailStyle = StyleSheet.create({
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
  commentSection: {
    height: '100%',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
  },
  selfComment: {
    alignSelf: 'flex-end',
    width: '100%',
  },
  selfCommentBody: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#A5C8FF',
  },
  stat: {
    margin: 5,
    alignItems: 'center',
  },
});
