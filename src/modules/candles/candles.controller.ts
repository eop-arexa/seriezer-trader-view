import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceEvent } from '../../shares/constants/constant';
import { IndexCandleRequestDto } from './candles.dto';
import { CompressResponse } from '../../shares/decorators/compress-response.decorator';

@Controller()
@UsePipes(ValidationPipe)
export class CandlesController {
  constructor(private readonly candleService: CandlesService) {}

  @CompressResponse()
  @MessagePattern(MicroserviceEvent.CANDLE_INDEX)
  indexCandle(@Payload() indexCandleFilter: IndexCandleRequestDto) {
    return this.candleService.indexCandle(indexCandleFilter);
  }
}
