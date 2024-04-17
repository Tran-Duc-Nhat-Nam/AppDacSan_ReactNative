import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useState, useEffect, Dispatch, SetStateAction} from 'react';
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
  static getUserReview = async (
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
}
