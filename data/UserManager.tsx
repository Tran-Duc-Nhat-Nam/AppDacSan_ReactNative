import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {NguoiDung} from '../models/NguoiDung';
import {
  LuotDanhGiaDacSan,
  LuotDanhGiaDacSanUI,
} from '../models/LuotDanhGiaDacSan';

export class UserManager {
  constructor() {}

  static subscribe = async (
    setUser: Dispatch<SetStateAction<FirebaseAuthTypes.User | undefined>>,
  ) => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log(user.uid);
      } else {
        setUser(undefined);
        console.log('No user');
      }
    });
  };

  static login = (username: string, password: string) => {
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(cre => {
        console.log('User ' + cre.user.uid + ' signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  static getUser = async (
    setND: Dispatch<SetStateAction<NguoiDung | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const response = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/nguoidung/' + user?.uid,
        );
        const json = await response.json();
        setND(json);
      } else {
        console.log('No ND');
      }
    });
  };
  static getReviews = async (
    dsID: number,
    setDG: Dispatch<SetStateAction<LuotDanhGiaDacSanUI[]>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      const response = await fetch(
        'https://dacsanimage-b5os5eg63q-de.a.run.app/danhgia/dacsan=' + dsID,
      );
      const json = await response.json();
      var result: LuotDanhGiaDacSanUI[] = [];
      var tempList: LuotDanhGiaDacSan[] = json;

      for (let item of tempList) {
        const response2 = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/nguoidung/' +
            item.id_nguoi_dung,
        );
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
    dsID: number,
    setState: Dispatch<SetStateAction<LuotDanhGiaDacSanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const response = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/danhgia/dacsan=' +
            dsID +
            '/nguoidung=' +
            user.uid,
        );
        const json = await response.json();
        const response2 = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/nguoidung/' + user.uid,
        );
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
    review: LuotDanhGiaDacSan,
    setState: Dispatch<SetStateAction<LuotDanhGiaDacSanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        review.id_nguoi_dung = user.uid;
        const response = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/danhgia/dacsan=' +
            review.id_dac_san,
          {
            method: method,
            body: JSON.stringify(review, (key, value) =>
              UserManager.replacer(key, value),
            ),
          },
        );
        const json = await response.json();
        if (json == true) {
          const response2 = await fetch(
            'https://dacsanimage-b5os5eg63q-de.a.run.app/nguoidung/' + user.uid,
          );
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
    review: LuotDanhGiaDacSan,
    setState: Dispatch<SetStateAction<LuotDanhGiaDacSanUI | undefined>>,
  ) => {
    this.reviewAPI('POST', review, setState);
  };

  static editReview = async (
    review: LuotDanhGiaDacSan,
    setState: Dispatch<SetStateAction<LuotDanhGiaDacSanUI | undefined>>,
  ) => {
    this.reviewAPI('PUT', review, setState);
  };

  static deleteReview = async (
    dsID: number,
    setState: Dispatch<SetStateAction<LuotDanhGiaDacSanUI | undefined>>,
  ) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const response = await fetch(
          'https://dacsanimage-b5os5eg63q-de.a.run.app/danhgia/dacsan=' +
            dsID +
            '/nguoidung=' +
            user.uid,
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
