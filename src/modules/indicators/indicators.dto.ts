import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CandleInterval } from '../candles/candles.constant';
import { TokenPair } from '../../shares/constants/constant';

export class IndexIndicatorRequestDto {
  @IsNotEmpty()
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

export class IndexFREQIndicatorRequestDto {
  @IsNotEmpty()
  startTime: string;

  @IsOptional()
  endTime?: string;

  @IsEnum(TokenPair)
  @IsNotEmpty()
  symbol?: TokenPair;
}
