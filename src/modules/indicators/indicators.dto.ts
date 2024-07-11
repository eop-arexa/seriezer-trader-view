import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CandleInterval } from '../candles/candles.constant';
import { TokenPair } from '../../shares/constants/constant';
import { IndicatorType } from './indicators.constant';

export class IndexIndicatorRequestDto {
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsEnum(CandleInterval)
  @IsNotEmpty()
  interval: CandleInterval = CandleInterval.min1;

  @IsEnum(TokenPair)
  @IsNotEmpty()
  symbol?: TokenPair;

  @IsEnum(IndicatorType)
  type: IndicatorType;
}

export class IndexFREQIndicatorRequestDto {
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime?: string;

  @IsEnum(TokenPair)
  @IsNotEmpty()
  symbol?: TokenPair;

  @IsEnum(CandleInterval)
  @IsOptional()
  interval?: CandleInterval;
}
