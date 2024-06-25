import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { QueueName } from './queue.constant';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.BlockchainOrder,
      defaultJobOptions: {
        backoff: 1,
        attempts: 1,
      },
    }),
    BullModule.registerQueue({
      name: QueueName.BlockchainUser,
      defaultJobOptions: {
        backoff: 2,
        attempts: 1,
      },
    }),
    BullModule.registerQueue({
      name: QueueName.BlockchainMembership,
      defaultJobOptions: {
        backoff: 1,
        attempts: 1,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
