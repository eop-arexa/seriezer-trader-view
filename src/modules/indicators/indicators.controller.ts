import { Controller } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroserviceEvent } from '../../shares/constants/constant';
import { IndexFREQIndicatorRequestDto, IndexIndicatorRequestDto, IndexIndicatorV2RequestDto } from './indicators.dto';
import { CompressResponse } from '../../shares/decorators/compress-response.decorator';

@Controller()
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @CompressResponse()
  @MessagePattern(MicroserviceEvent.INDICATOR_INDEX)
  indexIndicator(@Payload() indexIndicatorFilter: IndexIndicatorRequestDto) {
    return this.indicatorsService.indexIndicator(indexIndicatorFilter);
  }

  @CompressResponse()
  @MessagePattern(MicroserviceEvent.INDICATOR_INDEX_V2)
  indexIndicatorV2(@Payload() indexIndicatorFilter: IndexIndicatorV2RequestDto) {
    return this.indicatorsService.indexIndicatorV2(indexIndicatorFilter);
  }

  @CompressResponse()
  @MessagePattern(MicroserviceEvent.INDICATOR_FREQ_INDEX)
  indexFREQ(@Payload() indexFREQIndicatorFilter: IndexFREQIndicatorRequestDto) {
    return this.indicatorsService.indexFREQIndicator(indexFREQIndicatorFilter);
  }
}
