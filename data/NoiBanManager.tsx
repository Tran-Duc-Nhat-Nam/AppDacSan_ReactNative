import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {NguoiDung} from '../models/NguoiDung';
import {
  LuotDanhGiaNoiBan,
  LuotDanhGiaNoiBanUI,
} from '../models/LuotDanhGiaNoiBan';
import {url} from './UserManager';

export class NoiBanManager {
  constructor() {}

  static getReviews = async (
    id: number,
    setDG: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI[]>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      const response = await fetch(url + 'danhgia/noiban=' + id);
      const json = await response.json();
      var result: LuotDanhGiaNoiBanUI[] = [];
      var tempList: LuotDanhGiaNoiBan[] = json;

      for (let item of tempList) {
        const response2 = await fetch(url + 'nguoidung/' + item.id_nguoi_dung);
        const json2 = await response2.json();
        result.push({
          luot_danh_gia: item,
          ten_nguoi_dung: json2['ten'],
          is_placeholder: false,
          is_self: user ? user.uid == item.id_nguoi_dung : false,
        });
      }
      if (
        result.filter(item => {
          return item.is_self;
        }).length == 0 &&
        user
      ) {
        result.push({
          luot_danh_gia: undefined,
          ten_nguoi_dung: '',
          is_placeholder: true,
          is_self: true,
        });
      }
      setDG(result);
    });
  };

  static getUserReview = async (
    id: number,
    setState: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const response = await fetch(
          url + 'danhgia/noiban=' + id + '/nguoidung=' + user.uid,
        );
        const json = await response.json();
        const response2 = await fetch(url + 'nguoidung/' + user.uid);
        const json2 = await response2.json();
        setState({
          luot_danh_gia: json,
          ten_nguoi_dung: json2['ten'],
          is_self: true,
          is_placeholder: !json,
        });
      }
    });
  };

  static reviewAPI = async (
    method: string,
    review: LuotDanhGiaNoiBan,
    setState: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        review.id_nguoi_dung = user.uid;
        const response = await fetch(
          url + 'danhgia/noiban=' + review.id_noi_ban,
          {
            method: method,
            body: JSON.stringify(review, (key, value) =>
              NoiBanManager.replacer(key, value),
            ),
          },
        );
        const json = await response.json();
        if (json == true) {
          const response2 = await fetch(url + 'nguoidung/' + user.uid);
          const json2 = await response2.json();
          setState({
            luot_danh_gia: review,
            ten_nguoi_dung: json2['ten'],
            is_placeholder: false,
            is_self: true,
          });
        }
      }
    });
  };

  static review = async (
    review: LuotDanhGiaNoiBan,
    setState: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI | undefined>>,
  ) => {
    this.reviewAPI('POST', review, setState);
  };

  static editReview = async (
    review: LuotDanhGiaNoiBan,
    setState: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI | undefined>>,
  ) => {
    this.reviewAPI('PUT', review, setState);
  };

  static deleteReview = async (
    id: number,
    setState: Dispatch<SetStateAction<LuotDanhGiaNoiBanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const response = await fetch(
          url + 'danhgia/noiban=' + id + '/nguoidung=' + user.uid,
          {
            method: 'DELETE',
          },
        );
        const json = await response.json();
        if (json == true) {
          setState({
            luot_danh_gia: undefined,
            ten_nguoi_dung: '',
            is_placeholder: true,
            is_self: true,
          });
        }
      }
    });
  };

  static replacer = (key: any, value: any) => {
    if (key instanceof Date) {
      return key.toUTCString();
    }

    return value;
  };
}
