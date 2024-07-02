import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseOptions, getConfig } from '../../shares/helpers/utils';
import { ConfigService } from '../core/config.service';
import mongoose from 'mongoose';
const config = getConfig();

mongoose.set('debug', config.get('mongodb.debug'));

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => createMongooseOptions(configService.getMongodbConfiguration().uri),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
