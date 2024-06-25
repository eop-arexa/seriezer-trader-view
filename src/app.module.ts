import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { CoreModule } from './modules/core/core.module';
import { AllExceptionsFilter } from './shares/filters/exception.filter';
import { QueuesModule } from './modules/queue/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';

export const modules = [AuthModule, UsersModule];

@Module({
  imports: [CoreModule.register(), DatabaseModule, QueuesModule, ...modules],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
