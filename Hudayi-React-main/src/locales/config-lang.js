// @mui
import { enUS, frFR, zhCN, viVN, arSA, trTR } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  // {
  //   label: 'English',
  //   value: 'en',
  //   systemValue: enUS,
  //   icon: '/assets/icons/flags/ic_flag_en.svg',
  // },
  // {
  //   label: 'French',
  //   value: 'fr',
  //   systemValue: frFR,
  //   icon: '/assets/icons/flags/ic_flag_fr.svg',
  // },
  // {
  //   label: 'Vietnamese',
  //   value: 'vi',
  //   systemValue: viVN,
  //   icon: '/assets/icons/flags/ic_flag_vn.svg',
  // },
  {
    label: 'العربية',
    value: 'ar',
    systemValue: arSA,
    icon: '/assets/icons/flags/ic_flag_sa.svg',
  },
  {
    label: 'Turkish',
    value: 'tr',
    systemValue: trTR,
    icon: '/assets/icons/flags/ic_flag_tr.svg',
  },
];

export const defaultLang = allLangs[0]; // Arabic
