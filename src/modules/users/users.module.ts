import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { DBCollectionName } from '../database/database.const';
import { UserRepository } from './user.repository';
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: DBCollectionName.User, schema: UserSchema }])],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
