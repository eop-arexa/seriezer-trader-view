import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { QueuesModule } from './modules/queue/queue.module';
import { modules } from './app.module';
import { DatabaseModule } from './modules/database/database.module';
@Module({
  imports: [CoreModule.register(), DatabaseModule, QueuesModule, ...modules],
})
export class WorkerModule {}
