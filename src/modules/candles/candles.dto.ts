import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CandleInterval } from './candles.constant';
import { TokenPair } from '../../shares/constants/constant';

export class IndexCandleRequestDto {
  startTime: string;

  @IsOptional()
  endTime?: string;

  @IsEnum(CandleInterval)
  @IsNotEmpty()
  interval?: CandleInterval = CandleInterval.min1;

  @IsEnum(TokenPair)
  @IsNotEmpty()
  symbol?: TokenPair;
}
