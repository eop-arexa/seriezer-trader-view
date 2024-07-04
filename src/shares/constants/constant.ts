export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const COMPRESS_RESPONSE = 'COMPRESS_RESPONSE';
export enum UserProperties {
  USER_ID = 'id',
  USER_NAME = 'username',
}

export enum MerchantUserProperties {
  USER_ID = 'id',
  IDENTIFIER = 'identifier',
}

export enum AdminUserProperties {
  USER_ID = 'id',
  IDENTIFIER = 'identifier',
}

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: 'text/csv';
  size: number;
  buffer: Buffer;
}

export enum TokenPair {
  ETHUSDT = 'ETHUSDT',
  BNBUSDT = 'BNBUSDT',
  BTCUSDT = 'BTCUSDT',
  SOLUSDT = 'SOLUSDT',
  RUNEUSDT = 'RUNEUSDT',
  NEARUSDT = 'NEARUSDT',
  MATICUSDT = 'MATICUSDT',
  AVAXUSDT = 'AVAXUSDT',
  ARBUSDT = 'ARBUSDT',
}

export enum MicroserviceEvent {
  CANDLE_LATEST_ALL = `CANDLE.LATEST.ALL`,
  INDICATOR_LATEST_ALL = `INDICATOR.LATEST.ALL`,
  CANDLE_INDEX = `CANDLE.INDEX`,
  INDICATOR_INDEX = `INDICATOR.INDEX`,
  INDICATOR_FREQ_INDEX = `INDICATOR.FREQ.INDEX`,
}
