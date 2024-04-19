export type LuotDanhGiaNoiBan = {
  id_nguoi_dung: string;
  id_noi_ban: number;
  thoi_gian_danh_gia: Date;
  diem_danh_gia: number;
  noi_dung: string;
};

export type LuotDanhGiaNoiBanUI = {
  luot_danh_gia: LuotDanhGiaNoiBan | undefined;
  ten_nguoi_dung: string;
  is_placeholder: boolean;
  is_self: boolean;
};
