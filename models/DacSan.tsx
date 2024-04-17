import {HinhAnh} from './HinhAnh';
import {MuaDacSan} from './MuaDacSan';
import {ThanhPhan} from './ThanhPhan';
import {VungMien} from './VungMien';

export type DacSan = {
  id: number;
  ten: string;
  mo_ta: string;
  cach_che_bien: string;
  thanh_phan: ThanhPhan[];
  vung_mien: VungMien[];
  mua_dac_san: MuaDacSan[];
  ds_noi_ban: number[];
  luot_xem: number;
  diem_danh_gia: number;
  luot_danh_gia: number;
  hinh_dai_dien: HinhAnh;
  hinh_anh: HinhAnh[];
};
