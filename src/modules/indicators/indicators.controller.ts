import { Controller } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';

@Controller()
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}
}
