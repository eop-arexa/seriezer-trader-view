import { IsEnum, IsNotEmpty } from 'class-validator';
import { CandleInterval } from './candles.constant';
import { TokenPair } from '../../shares/constants/constant';

export class IndexCandleRequestDto {
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsEnum(CandleInterval)
  @IsNotEmpty()
  interval: CandleInterval;

  @IsEnum(TokenPair)
  @IsNotEmpty()
  symbol: TokenPair;
}
