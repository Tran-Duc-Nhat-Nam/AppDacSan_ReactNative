export type LuotDanhGiaDacSan = {
  id_nguoi_dung: string;
  id_dac_san: number;
  thoi_gian: Date;
  diem_danh_gia: number;
  noi_dung: string;
};

export type LuotDanhGiaDacSanUI = {
  luot_danh_gia: LuotDanhGiaDacSan | undefined;
  ten_nguoi_dung: string;
  is_placeholder: boolean;
  is_self: boolean;
};
