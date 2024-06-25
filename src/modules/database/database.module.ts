import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { createMongooseOptions } from '../../shares/helpers/utils';
import { ConfigService } from '../core/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        createMongooseOptions(
          configService.getMongodbConfiguration().uri
        ),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
