import { CandleInterval } from '../candles/candles.constant';

export const IndicatorCodes = [
  'FREQ-Base',
  'FREQ-5min',
  'FREQ-15min',
  'DEMA-1a',
  'DEMA-1b',
  'DEMA-2a',
  'DEMA-2b',
  'DEMA-3a',
  'DEMA-3b',
  'NWE-15min',
  'MAGIC-15min',
  'FREQ-30min',
  'FREQ-60min',
  'NWE-60min',
  'MAGIC-60min',
  'FREQ-240min',
  'DEMA-4a',
  'DEMA-4b',
];

export enum IndicatorType {
  DEMA = 'DEMA', // DEMAs
  FREQ = 'FREQ', // Frequencies
  NWE = 'NWE', // Nadaraya-Watson Envelop signal
  MAGIC = 'MAGIC', // Magic signals based on candle stabilities and patterns.
}

export enum ValueCalcType {
  Open = 'Open',
  High = 'High',
  Low = 'Low',
  Close = 'Close',
  Avgarage = 'Avgarage',
}

export interface IIndicatorParam {
  valueCalcType: ValueCalcType;
}

export interface IIndicatorDemaParam extends IIndicatorParam {
  interval: number;
}

export interface IIndicatorFreqParam extends IIndicatorParam {
  avgGainInterval: number; // 14
  avgLossInterval: number; // 14
  hiInterval: number; // 9
  loInterval: number; // 9
  kInterval: number; // 3
  dInterval: number; // 3
  sInterval: number; // 3
}

export enum NWEType {
  Upper = 'Upper',
  Lower = 'Lower',
}

export interface IIndicatorNWEParam extends IIndicatorParam {
  interval: number; // 500, how much candle data is used maximum, if more then 500, then only 500 is used, 500 is hard cap.
  bandwidth: number;
  multiplier: number;
  repaint: boolean; // the new candle casues recalculateing the already signals?
  nweType: NWEType;
}

export interface IIndicatorMagicParam extends IIndicatorParam {
  interval: number; // 14
  candleStabilityIndex: number; // 0.5
  rsiIndexParam: number; // 50
  candleDeltaLengthParam: number; // 5
  disableRepeatingSignalsParam: boolean; // false
}

export type IndicatorParam<T> = T extends IndicatorType.DEMA
  ? IIndicatorDemaParam
  : T extends IndicatorType.FREQ
  ? IIndicatorFreqParam
  : T extends IndicatorType.NWE
  ? IIndicatorNWEParam
  : T extends IndicatorType.MAGIC
  ? IIndicatorMagicParam
  : unknown;

export interface IPredictionParam {
  d2avgInterval: number;
  futureInterval: number; // 20, length of the futureValues array, How many future data points to show
  showOldprediction: number[]; // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
}

export interface IParamGeneric<T extends IndicatorType> {
  symbol: string;
  type: T;
  code: string;
  interval: CandleInterval;
  color: string;
  indicatorParam: IndicatorParam<T>;
  predictionParam: IPredictionParam;
}

export type IndicatorDef =
  | IParamGeneric<IndicatorType.DEMA>
  | IParamGeneric<IndicatorType.FREQ>
  | IParamGeneric<IndicatorType.NWE>
  | IParamGeneric<IndicatorType.MAGIC>;

export interface IPrediction {
  d2avg: number | null; // avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; // [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; // [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export interface ICalcDetail {
  candleValue: number;
  calculatedValue: number | null;
  isSignal: number;
}

export interface IDemaCalcDetail extends ICalcDetail {
  candleValue: number; // 12, act.close or the given algorithm
  calculatedValue: number | null;
  isSignal: number;
}

export interface IFreqCalcDetail extends ICalcDetail {
  candleValue: number; // 12, act.close or the given algorithm

  change: number | null; // -1, act.value - prev.value
  gain: number | null; // 0, max(act.change, 0)
  loss: number | null; // -1, min(act.change, 0)
  avgGain: number | null; // 1.5, (act.gain * 1/14) + (prev.avgGain * 13 / 14)
  avgLoss: number | null; // 2.6 (act.loss * 1/14) + (prev.avgLoss * 13 / 14)
  rs: number | null; // 0.55, act.avgGain/act.avgLoss
  rsi: number | null; // 0.81, act.rs===0 ? 100 : 100 - ( 1/(1+act.rs) * 104
  hi: number | null; // 0.9, max(act.rsi, prev1.rsi, prev2.rsi...), 9 item
  lo: number | null; // 0.7, min(act.rsi, prev1.rsi, prev2.rsi...), 9 item
  fRaw: number | null; // 40 (rsi-lo)/(hi-lo)*100
  k: number | null; // 55 act.fRaw*1/3 + prev.k*2/3
  d: number | null; // 48 act.k*1/3 + prev.d*2/3
  s: number | null; // 47 act.d*1/3 + prev.s*2/3

  calculatedValue: number | null;
  isSignal: number;
}

export interface INWECalcDetails extends ICalcDetail {
  candleValue: number;
  calculatedValue: number | null;

  nweValues: { value: number; lower: number; upper: number; isSignal: number }[];

  mae: number; // mae and this is the delta from the mid-point. The calculatedValue is mid-point.
  lower: number;
  upper: number;
  isSignal: number; // crossed, red or grean "trianlge/arrow"
}

export interface IMagicCalcDetails extends ICalcDetail {
  candleValue: number;
  calculatedValue: number | null;
  isSignal: number;
}

export interface IIndicatorBase<T extends ICalcDetail> extends IPrediction {
  order: number;
  calcDetail: T;
  value: number | null;
  d1: number | null; // first derivative: act.value-prev.value
  d2: number | null; // second derivative: act.d1 - prev.d1
  // extends IPrediction
  d2avg: number | null; // avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; // [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; // [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export type IndicatorCalcDetail<T> = T extends IndicatorType.DEMA
  ? IDemaCalcDetail
  : T extends IndicatorType.FREQ
  ? IFreqCalcDetail
  : T extends IndicatorType.NWE
  ? INWECalcDetails
  : T extends IndicatorType.MAGIC
  ? IMagicCalcDetails
  : unknown;

export interface IIndicatorGeneric<T extends IndicatorType> extends IIndicatorBase<IndicatorCalcDetail<T>> {
  // MongoDB id;
  _id?: string;
  isInsertedToDB?: boolean;
  symbol: string;
  type: T;
  code: string;
  start: number;
  end: number;
  prevData: IIndicatorBase<IndicatorCalcDetail<T>>[];
  interval: CandleInterval;
  // extends IIndicatorBase
  order: number;
  calcDetail: IndicatorCalcDetail<T>;
  value: number | null;
  d1: number | null; // first derivative: act.value-prev.value
  d2: number | null; // second derivative: act.d1 - prev.d1
  d2avg: number | null; // avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; // [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; // [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export type IIndicator =
  | IIndicatorGeneric<IndicatorType.DEMA>
  | IIndicatorGeneric<IndicatorType.FREQ>
  | IIndicatorGeneric<IndicatorType.NWE>
  | IIndicatorGeneric<IndicatorType.MAGIC>;
