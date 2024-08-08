import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IndicatorCalcDetail, IndicatorType } from './indicators.constant';
import { Timestamp } from 'bson';
import { getConfig } from '../../shares/helpers/utils';

export type IndicatorHistoryDocument = IndicatorHistory<IndicatorType> & Document;

@Schema({ timestamps: true, autoIndex: getConfig().get('mongodb.autoIndex') })
export class IndicatorHistory<
  T extends IndicatorType.DEMA | IndicatorType.MAGIC | IndicatorType.NWE | IndicatorType.FREQ,
> {
  @Prop()
  id: string;

  @Prop({ type: Timestamp })
  start: number;

  @Prop({ type: String })
  code: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String, unique: true, required: true })
  uniqueId: string;

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

export const IndicatorHistoriesSchema = SchemaFactory.createForClass(IndicatorHistory);
IndicatorHistoriesSchema.index({ start: 1, code: 1, order: -1 });
IndicatorHistoriesSchema.index({ type: 1, start: -1 });
