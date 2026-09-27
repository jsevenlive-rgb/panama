export const CURRENT_VERSION = {
  cmd: '1',
  site: '3',
  method: '1',
};

export const AVAILABLE_VERSIONS = {
  cmd: ['1'],
  site: ['1', '2', '3'],
  method: ['1'],
};

export enum LanguageList {
  ru = 'russian',
  en = 'english',
  cn = 'none', // Тут в значении ошибки нет. none нужно для mongo db
}

export enum LanguageListISO {
  ru = 'ru',
  en = 'en',
  cn = 'cn',
}

export enum Currency {
  rub = 'rub',
  usd = 'usd',
}

// В копейках/центах
export const REFERRAL_REGISTER_AMOUNT = {
  rub: 40000,
  usd: 500,
};
