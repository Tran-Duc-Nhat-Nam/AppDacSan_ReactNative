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
import {darkTheme, lightTheme, style} from '../App';
import {useRoute} from '@react-navigation/native';
import {NoiBan} from '../models/NoiBan';
import React, {useEffect, useState} from 'react';
import {Button, Chip, Icon, TextInput} from 'react-native-paper';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NoiBanManager} from '../data/NoiBanManager';
import {detailStyle, SectionTextBody, Star} from './FoodDetailsScreen';
import {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  Menu,
} from 'react-native-popup-menu';
import {LuotDanhGiaNoiBanUI} from '../models/LuotDanhGIaNoiBan';
import Modal from 'react-native-modal/dist/modal';
import {url} from '../data/UserManager';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export const PlaceDetailsScreen = (props: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const route = useRoute();
  const {itemId} = route.params;
  const [nd, setND] = useState<LuotDanhGiaNoiBanUI[]>([]);
  const [selfComment, setSelfComment] = useState<LuotDanhGiaNoiBanUI>();
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [nb, setNB] = useState<NoiBan>();

  useEffect(() => {
    getDSFromApi();
  }, []);

  const getDSFromApi = async () => {
    try {
      const response = await fetch(url + 'noiban/' + itemId);
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
          backgroundColor: isDarkMode
            ? darkTheme.colors.background
            : lightTheme.colors.background,
          flex: 1,
        }}>
        <Text style={style.header}>{nb ? nb.ten : ''}</Text>
        <View style={{height: 8}} />
        <View style={{height: 8}} />
        <View
          style={[
            detailStyle.section,
            {flexDirection: 'row', justifyContent: 'space-around', padding: 10},
          ]}>
          <Stat number={nb!.luot_xem} title="Lượt xem" />
          <Stat number={nb!.luot_danh_gia} title="Lượt đánh giá" />
          <Stat number={nb!.diem_danh_gia} title="Điểm trung bình" />
        </View>
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Mô tả</Text>
          <SectionTextBody title={nb!.mo_ta} numberOfLines={4} />
        </View>
        <View style={detailStyle.section}>
          <Text style={detailStyle.sectionHeader}>Địa chỉ</Text>
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
        <Button
          children={<Text>Xem nhận xét về nơi bán</Text>}
          onPress={() => {
            NoiBanManager.getReviews(itemId, setND);
            NoiBanManager.getUserReview(itemId, setSelfComment);
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
                  <Text>{nb ? nb.diem_danh_gia : 0}</Text>
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
                                NoiBanManager.deleteReview(
                                  nb!.id,
                                  setSelfComment,
                                )
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
                        Hãy đánh giá về {nb?.ten}
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
                          NoiBanManager.review(
                            {
                              id_noi_ban: nb ? nb.id : -1,
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
