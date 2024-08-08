import { CandleInterval, ICandle } from '../candles/candles.constant';
import { calcIntervalEnd, calcIntervalStart, getMinute } from '../../shares/helpers/utils';

export const IndicatorCodes = [
  { code: 'FREQ-Base', intervalMinutes: 60000 },
  { code: 'FREQ-5min', intervalMinutes: 300000 },
  { code: 'FREQ-15min', intervalMinutes: 900000 },
  { code: 'DEMA-1a', intervalMinutes: 900000 },
  { code: 'DEMA-1b', intervalMinutes: 900000 },
  { code: 'DEMA-2a', intervalMinutes: 900000 },
  { code: 'DEMA-2b', intervalMinutes: 900000 },
  { code: 'DEMA-3a', intervalMinutes: 900000 },
  { code: 'DEMA-3b', intervalMinutes: 900000 },
  { code: 'NWE-15min', intervalMinutes: 900000 },
  { code: 'MAGIC-15min', intervalMinutes: 900000 },
  { code: 'FREQ-30min', intervalMinutes: 1800000 },
  { code: 'FREQ-60min', intervalMinutes: 3600000 },
  { code: 'NWE-60min', intervalMinutes: 3600000 },
  { code: 'MAGIC-60min', intervalMinutes: 3600000 },
  { code: 'FREQ-240min', intervalMinutes: 14400000 },
  { code: 'DEMA-4a', intervalMinutes: 14400000 },
  { code: 'DEMA-4b', intervalMinutes: 14400000 },
];

export enum IndicatorType {
  DEMA = 'DEMA', //  DEMAs
  FREQ = 'FREQ', //  Frequencies
  NWE = 'NWE', //  Nadaraya-Watson Envelop signal
  MAGIC = 'MAGIC', //  Magic signals based on candle stabilities and patterns.
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
  offset: number;
}

export interface IIndicatorDemaParam extends IIndicatorParam {
  interval: number;
}

export interface IIndicatorFreqParam extends IIndicatorParam {
  avgGainInterval: number; //  14
  avgLossInterval: number; //  14
  hiInterval: number; //  9
  loInterval: number; //  9
  kInterval: number; //  3
  dInterval: number; //  3
  sInterval: number; //  3
}

export enum NWEType {
  Upper = 'Upper',
  Lower = 'Lower',
}

export const IndicatorDefDB: IndicatorDef[] = [
  //  DEMA-1a 15min/11
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-1a',
    interval: CandleInterval.min15,
    color: 'Red',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 11,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-1b 15min/22
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-1b',
    interval: CandleInterval.min15,
    color: 'Green',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 22,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-2a 15min/120
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-2a',
    interval: CandleInterval.min15,
    color: 'Blue',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 120,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-2b 15min/480
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-2b',
    interval: CandleInterval.min15,
    color: 'Lilac',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 480,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-3a 15min/1200
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-3a',
    interval: CandleInterval.min15,
    color: 'White',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 1200,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-3b 15min/1800
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-3b',
    interval: CandleInterval.min15,
    color: 'Orange',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 1800,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-4a 240min/600
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-4a',
    interval: CandleInterval.min240,
    color: 'Dark Blue',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 600,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 5, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // DEMA-4b 240min/1200
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.DEMA,
    code: 'DEMA-4b',
    interval: CandleInterval.min240,
    color: 'Dark Red',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 0,
      interval: 1200,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 5, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },

  // FREQ-Base 1min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-Base',
    interval: CandleInterval.min1,
    color: 'Red',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 1,
      avgGainInterval: 14, // 14
      avgLossInterval: 14, // 14
      hiInterval: 9, // 9
      loInterval: 9, // 9
      kInterval: 3, // 3
      dInterval: 3, // 3
      sInterval: 3, // 3
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 1200, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // FREQ-5min 5min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-5min',
    interval: CandleInterval.min5,
    color: 'Orange',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 5,
      avgGainInterval: 14, // 14
      avgLossInterval: 14, // 14
      hiInterval: 9, // 9
      loInterval: 9, // 9
      kInterval: 3, // 3
      dInterval: 3, // 3
      sInterval: 3, // 3
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 240, // 20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], // [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  // FREQ-15min 15min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-15min',
    interval: CandleInterval.min15,
    color: 'Yellow',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 15,
      avgGainInterval: 14,
      avgLossInterval: 14,
      hiInterval: 9,
      loInterval: 9,
      kInterval: 3,
      dInterval: 3,
      sInterval: 3,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 80, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  //  FREQ-30min 30min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-30min',
    interval: CandleInterval.min30,
    color: 'Green',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 30,
      avgGainInterval: 14, //  14
      avgLossInterval: 14, //  14
      hiInterval: 9,
      loInterval: 9,
      kInterval: 3,
      dInterval: 3,
      sInterval: 3,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 40, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  //  FREQ-60min 60min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-60min',
    interval: CandleInterval.min60,
    color: 'Blue',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 60,
      avgGainInterval: 14,
      avgLossInterval: 14,
      hiInterval: 9,
      loInterval: 9,
      kInterval: 3,
      dInterval: 3,
      sInterval: 3,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 20, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  //  FREQ-240min 240min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.FREQ,
    code: 'FREQ-240min',
    interval: CandleInterval.min240,
    color: 'Purple',
    indicatorParam: {
      valueCalcType: ValueCalcType.Avgarage,
      offset: 240,
      avgGainInterval: 14,
      avgLossInterval: 14,
      hiInterval: 9,
      loInterval: 9,
      kInterval: 3,
      dInterval: 3,
      sInterval: 3,
    },
    predictionParam: {
      d2avgInterval: 9,
      futureInterval: 5, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },

  //  NWE-15min 15min Lower-Upper
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.NWE,
    code: 'NWE-15min',
    interval: CandleInterval.min15,
    color: 'Red:Green',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 10,
      interval: 500,
      bandwidth: 8,
      multiplier: 3,
      repaint: true,
      nweType: NWEType.Lower,
    },
    predictionParam: {
      d2avgInterval: 8,
      futureInterval: 80, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  //  NWE-60min 60min Lower-Upper
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.NWE,
    code: 'NWE-60min',
    interval: CandleInterval.min60,
    color: 'Red:Green',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 10,
      interval: 500,
      bandwidth: 8,
      multiplier: 3,
      repaint: true,
      nweType: NWEType.Lower,
    },
    predictionParam: {
      d2avgInterval: 8,
      futureInterval: 20, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [-1, -2, -3, -4, -5, -10], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },

  //  MAGIC-15min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.MAGIC,
    code: 'MAGIC-15min',
    interval: CandleInterval.min15,
    color: 'Green1',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 10,
      interval: 14,
      candleStabilityIndex: 0.5,
      rsiIndexParam: 50,
      candleDeltaLengthParam: 5,
      disableRepeatingSignalsParam: false,
    },
    predictionParam: {
      d2avgInterval: 8,
      futureInterval: 0, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
  //  MAGIC-60min
  {
    symbol: 'BTCUSDT',
    type: IndicatorType.MAGIC,
    code: 'MAGIC-60min',
    interval: CandleInterval.min60,
    color: 'Green2',
    indicatorParam: {
      valueCalcType: ValueCalcType.Close,
      offset: 10,
      interval: 14,
      candleStabilityIndex: 0.5,
      rsiIndexParam: 50,
      candleDeltaLengthParam: 5,
      disableRepeatingSignalsParam: false,
    },
    predictionParam: {
      d2avgInterval: 8,
      futureInterval: 0, //  20, length of the futureValues array, How many future data points to show
      showOldprediction: [], //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
    },
  },
];

const CandleCache: Record<string, Record<CandleInterval, ICandle[]>> = {
  BTCUSDT: {
    '1min': [],
    '5min': [],
    '15min': [],
    '30min': [],
    '60min': [],
    '240min': [],
    '720min': [],
    '1440min': [],
  },
};

const IndicatorCache: Record<string, Record<CandleInterval, Record<string, IIndicator[]>>> = {
  BTCUSDT: {
    '1min': { 'FREQ-Base': [] },
    '5min': { 'FREQ-5min': [] },
    '15min': {
      'FREQ-15min': [],
      'DEMA-1a': [],
      'DEMA-1b': [],
      'DEMA-2a': [],
      'DEMA-2b': [],
      'DEMA-3a': [],
      'DEMA-3b': [],
      'NWE-15min': [],
      'MAGIC-15min': [],
    },
    '30min': { 'FREQ-30min': [] },
    '60min': { 'FREQ-60min': [], 'NWE-60min': [], 'MAGIC-60min': [] },
    '240min': { 'FREQ-240min': [], 'DEMA-4a': [], 'DEMA-4b': [] },
    '720min': {},
    '1440min': {},
  },
};

export const FreqIndicatorCodes = ['FREQ-Base', 'FREQ-5min', 'FREQ-15min', 'FREQ-30min', 'FREQ-60min', 'FREQ-240min'];

export interface IIndicatorNWEParam extends IIndicatorParam {
  interval: number; //  500, how much candle data is used maximum, if more then 500, then only 500 is used, 500 is hard cap.
  bandwidth: number;
  multiplier: number;
  repaint: boolean; //  the new candle casues recalculateing the already signals?
  nweType: NWEType;
}

export interface IIndicatorMagicParam extends IIndicatorParam {
  interval: number; //  14
  candleStabilityIndex: number; //  0.5
  rsiIndexParam: number; //  50
  candleDeltaLengthParam: number; //  5
  disableRepeatingSignalsParam: boolean; //  false
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
  futureInterval: number; //  20, length of the futureValues array, How many future data points to show
  showOldprediction: number[]; //  [-1, -2, -3, -4, -5, -10], which older predictive futureValues to be shown
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
  d2avg: number | null; //  avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; //  [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; //  [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export interface ICalcDetail {
  candleValue: number;
  calculatedValue: number | null;
  isSignal: number;
}

export interface IDemaCalcDetail extends ICalcDetail {
  candleValue: number; //  12, act.close or the given algorithm
  calculatedValue: number | null;
  isSignal: number;
}

export interface IFreqCalcDetail extends ICalcDetail {
  candleValue: number; //  12, act.close or the given algorithm

  change: number | null; //  -1, act.value - prev.value
  gain: number | null; //  0, max(act.change, 0)
  loss: number | null; //  -1, min(act.change, 0)
  avgGain: number | null; //  1.5, (act.gain * 1/14) + (prev.avgGain * 13 / 14)
  avgLoss: number | null; //  2.6 (act.loss * 1/14) + (prev.avgLoss * 13 / 14)
  rs: number | null; //  0.55, act.avgGain/act.avgLoss
  rsi: number | null; //  0.81, act.rs===0 ? 100 : 100 - ( 1/(1+act.rs) * 104
  hi: number | null; //  0.9, max(act.rsi, prev1.rsi, prev2.rsi...), 9 item
  lo: number | null; //  0.7, min(act.rsi, prev1.rsi, prev2.rsi...), 9 item
  fRaw: number | null; //  40 (rsi-lo)/(hi-lo)*100
  k: number | null; //  55 act.fRaw*1/3 + prev.k*2/3
  d: number | null; //  48 act.k*1/3 + prev.d*2/3
  s: number | null; //  47 act.d*1/3 + prev.s*2/3

  calculatedValue: number | null;
  isSignal: number;
}

export interface INWECalcDetails extends ICalcDetail {
  candleValue: number;
  calculatedValue: number | null;

  nweValues: { value: number; lower: number; upper: number; isSignal: number }[];

  mae: number; //  mae and this is the delta from the mid-point. The calculatedValue is mid-point.
  lower: number;
  upper: number;
  isSignal: number; //  crossed, red or grean "trianlge/arrow"
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
  d1: number | null; //  first derivative: act.value-prev.value
  d2: number | null; //  second derivative: act.d1 - prev.d1
  //  extends IPrediction
  d2avg: number | null; //  avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; //  [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; //  [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
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
  //  MongoDB id;
  _id?: string;
  isInsertedToDB?: boolean;
  symbol: string;
  type: T;
  code: string;
  start: number;
  end: number;
  prevData: IIndicatorBase<IndicatorCalcDetail<T>>[];
  interval: CandleInterval;
  //  extends IIndicatorBase
  order: number;
  calcDetail: IndicatorCalcDetail<T>;
  value: number | null;
  d1: number | null; //  first derivative: act.value-prev.value
  d2: number | null; //  second derivative: act.d1 - prev.d1
  d2avg: number | null; //  avarage of d2 of the X previous items, where X is a parameter
  d1Prediction: (number | null)[]; //  [d1 + d2avg, d1Prediction[0] + d2avg, ... ]
  valuePrediction: (number | null)[]; //  [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export type IIndicator =
  | IIndicatorGeneric<IndicatorType.DEMA>
  | IIndicatorGeneric<IndicatorType.FREQ>
  | IIndicatorGeneric<IndicatorType.NWE>
  | IIndicatorGeneric<IndicatorType.MAGIC>;

export function adjustPrediction(
  predictions: { index: number; lastKnownValue: number | null; valuePredictions: (number | null)[] }[],
  adjustment: number,
  intervalRatio: number,
  futureCandleCount: number,
): { candleIndex: number; isSignal: number; value: (number | null)[] }[] {
  const result: { candleIndex: number; isSignal: number; value: (number | null)[] }[] = [];

  let candleIndex = -1;

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.valuePredictions.length; j++) {
      const actPredictionValue = prediction.valuePredictions[j];

      const num = j === 0 ? adjustment + intervalRatio : intervalRatio;
      if (i === 0) {
        for (let k = 0; k < num; k++) {
          result.push({
            candleIndex,
            isSignal: 0,
            value: [],
          });
          candleIndex--;
        }
      }

      const resultIndex = (j + 1) * intervalRatio + adjustment - num;
      let oldPredictionValue = j === 0 ? prediction.lastKnownValue : prediction.valuePredictions[j - 1];
      let divisor = num;
      for (let k = 0; k < num; k++) {
        const resultItem = result[resultIndex + k];
        if (actPredictionValue == null || oldPredictionValue == null) {
          resultItem.value.push(null);
          continue;
        }
        oldPredictionValue = oldPredictionValue + (actPredictionValue - oldPredictionValue) / divisor;
        divisor--;
        resultItem.value.push(oldPredictionValue);
      }
    }
  }
  result.splice(futureCandleCount, result.length - 1);
  return result;
}

export interface IAdjustedTimeFrameIndicator {
  symbol: string;
  interval: CandleInterval;
  data: {
    isPrediction: boolean;
    start: number;
    end: number;
    indicators: {
      code: string;
      isSignal: number;
      value: (number | null)[];
      upper?: (number | null)[];
      lower?: (number | null)[];
    }[];
  }[];
}

export function adjustIndicatorTimeline(
  indicators: IIndicator[],
  candleCount: number,
  offset: number,
  indicatorInterval: CandleInterval,
  candleInterval: CandleInterval,
  showOldPrediction: number[],
  indicatorType: IndicatorType,
): {
  candleIndex: number;
  isSignal: number;
  value: (number | null)[];
  upper?: (number | null)[];
  lower?: (number | null)[];
}[] {
  const targetIndicatorInterval = getMinute(indicatorInterval);
  const indicatorOffset = offset / targetIndicatorInterval;
  const targetCandleInterval = getMinute(candleInterval);
  const intervalRatio = targetIndicatorInterval / targetCandleInterval;
  const result: {
    candleIndex: number;
    isSignal: number;
    value: (number | null)[];
    upper?: (number | null)[];
    lower?: (number | null)[];
  }[] = [];

  const adjustment = Math.floor((targetIndicatorInterval - indicators[0].order) / targetCandleInterval);

  const predictionsData: { index: number; lastKnownValue: number | null; valuePredictions: (number | null)[] }[] = [];
  // const predictionToCandleIndexes = showOldPrediction.map((v) =>
  // 	intervalRatio >= 1 ? Math.ceil((Math.abs(v) - indicatorOffset) * intervalRatio - adjustment) : Math.abs(v),
  // );
  for (let i = 0; i < candleCount; i++) {
    // Calculate the indicator index based on the interval ratio
    const indicatorIndex = Math.floor((i + adjustment) / intervalRatio + indicatorOffset);

    if (indicatorIndex >= 0 && indicatorIndex < indicators.length) {
      const indicator = indicators[indicatorIndex];

      const indicatorPrevDataIndex =
        intervalRatio > 1
          ? targetIndicatorInterval - ((i + adjustment) % intervalRatio) * targetCandleInterval
          : targetIndicatorInterval;

      const indicatorData =
        indicator.prevData.length > indicatorPrevDataIndex ? indicator.prevData[indicatorPrevDataIndex] : indicator;

      // collect predictions
      // if (i === 0 || predictionToCandleIndexes.includes(i)) {
      if (i === 0) {
        predictionsData.push({
          index: indicatorIndex,
          lastKnownValue: indicatorData.value,
          valuePredictions: indicatorData.valuePrediction.slice(indicatorIndex),
        });
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < showOldPrediction.length; j++) {
          const oldIndicatorIndex = indicatorIndex - showOldPrediction[j];
          if (oldIndicatorIndex >= 0 && oldIndicatorIndex < indicators.length) {
            predictionsData.push({
              index: oldIndicatorIndex,
              lastKnownValue: indicators[oldIndicatorIndex].value,
              valuePredictions: indicators[oldIndicatorIndex].valuePrediction.slice(oldIndicatorIndex),
            });
          }
        }
      }

      result.push({
        candleIndex: i,
        isSignal: indicatorData.calcDetail.isSignal,
        value: [indicatorData.value],
        ...(indicatorType === IndicatorType.NWE && {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          upper: [indicatorData.calcDetail.upper],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          lower: [indicatorData.calcDetail.lower],
        }),
      });
    } else {
      result.push({
        candleIndex: i,
        isSignal: 0,
        value: [null],
        ...(indicatorType === IndicatorType.NWE && {
          upper: [null],
          lower: [null],
        }),
      });
    }
  }
  // NOTE: the last parameter is currently fix 20. However, it can be an external parameter.
  // What it does: how many future candly is calculated.
  const adjustedPredictions = adjustPrediction(predictionsData, adjustment, intervalRatio < 1 ? 1 : intervalRatio, 20);
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < adjustedPredictions.length; i++) {
    const adjustedPrediction = adjustedPredictions[i];
    result.unshift({
      candleIndex: adjustedPrediction.candleIndex,
      isSignal: adjustedPrediction.isSignal,
      value: adjustedPrediction.value.slice(),
      // ...(indicatorType === IndicatorType.NWE && {
      //   upper: [null],
      //   lower: [null],
      // }),
    });
  }
  return result;
}
