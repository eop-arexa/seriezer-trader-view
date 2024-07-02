import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CandleInterval } from './candles.constant';
import { Timestamp } from 'bson';

export type CandleDocument = Candle & Document;

@Schema({ timestamps: true, autoIndex: true })
export class Candle {
  @Prop()
  id: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ enum: CandleInterval })
  interval: CandleInterval;

  @Prop({ type: Timestamp })
  start: number;

  @Prop({ type: Timestamp })
  end: number;

  @Prop({ type: Timestamp })
  lastEnd: number; // Last process 1min candle end

  @Prop({ type: Number })
  op: number; // open

  @Prop({ type: Number })
  hi: number; // high

  @Prop({ type: Number })
  lo: number; // low

  @Prop({ type: Number })
  cl: number; // close

  @Prop({ type: Number })
  bv: number; // Base Volume

  @Prop({ type: Number })
  qv: number; // Quote asset volume

  @Prop({ type: Number })
  cnt: number; // Trades

  @Prop({ type: Number })
  tbv: number; // Taker buy base asset volume

  @Prop({ type: Number })
  tqv: number; // Taker buy quote asset volume
}

export const CandlesSchema = SchemaFactory.createForClass(Candle);
CandlesSchema.index({ start: 1, interval: 1 }, { unique: true });
CandlesSchema.index({ end: 1, interval: 1 }, { unique: true });
CandlesSchema.index({ interval: 1, start: -1 });
