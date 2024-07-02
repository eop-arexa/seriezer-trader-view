export enum CandleInterval {
  min1 = '1min',
  min5 = '5min',
  min15 = '15min',
  min30 = '30min',
  min60 = '60min', // 1h
  min240 = '240min', // 4h
  min720 = '720min', // 12h
  min1440 = '1440min', // 1d
}

export interface ICandle {
  id?: number;
  symbol: string;
  interval: CandleInterval;
  start: number; // start
  end: number; // end
  lastEnd: number; // last process 1min candle end
  op: number; // open
  hi: number; // high
  lo: number; // low
  cl: number; // close
  bv: number; // Base Volume
  qv: number; // Quote asset volume
  cnt: number; // Trades
  tbv: number; // Taker buy base asset volume
  tqv: number; // Taker buy quote asset volume
}
