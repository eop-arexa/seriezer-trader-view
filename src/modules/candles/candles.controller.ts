import { Controller, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceEvent } from '../../shares/constants/constant';
import { IndexCandleRequestDto } from './candles.dto';
import { MicroserviceLoggingInterceptor } from '../../shares/interceptors/microservice-logging.interceptor';

@Controller()
@UsePipes(ValidationPipe)
@UseInterceptors(MicroserviceLoggingInterceptor)
export class CandlesController {
  constructor(private readonly candleService: CandlesService) {}

  @MessagePattern(MicroserviceEvent.CANDLE_INDEX)
  indexCandle(@Payload() indexCandleFilter: IndexCandleRequestDto) {
    return this.candleService.indexCandle(indexCandleFilter);
  }
}
