import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Timestamp } from 'bson';
import { CandleInterval } from '../candles/candles.constant';
import { IIndicatorBase, IndicatorCalcDetail, IndicatorType } from './indicators.constant';

export type IndicatorDocument = Indicator<IndicatorType> & Document;

@Schema({ timestamps: true, autoIndex: true })
export class Indicator<T extends IndicatorType.DEMA | IndicatorType.MAGIC | IndicatorType.NWE | IndicatorType.FREQ> {
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

  @Prop({ enum: IndicatorType })
  type: IndicatorType;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Object })
  prevData: IIndicatorBase<IndicatorCalcDetail<T>>[];

  @Prop({ type: Number })
  order: number;

  @Prop({ type: Object })
  calcDetail: IndicatorCalcDetail<T>;

  @Prop({ type: Number, required: false })
  value: number | null;

  @Prop({ type: Number, required: false })
  d1: number | null; // first derivative: act.value-prev.value

  @Prop({ type: Number, required: false })
  d2: number | null; // second derivative: act.d1 - prev.d1

  @Prop({ type: Number, required: false })
  d2avg: number | null; // average of d2 of the X previous items, where X is a parameter

  @Prop({ type: [Number], default: [] })
  d1Prediction: (number | null)[]; // [d1 + d2avg, d1Prediction[0] + d2avg, ... ]

  @Prop({ type: [Number], default: [] })
  valuePrediction: (number | null)[]; // [ value + d1Prediction[0], valuePrediction[0] + d1Prediction[1], ... ]
}

export const IndicatorsSchema = SchemaFactory.createForClass(Indicator);
IndicatorsSchema.index({ start: 1, code: 1 }, { unique: true });
IndicatorsSchema.index({ end: 1, code: 1 }, { unique: true });
IndicatorsSchema.index({ code: 1, start: -1 });
