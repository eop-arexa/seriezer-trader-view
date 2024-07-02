import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getConfig } from '../../shares/helpers/utils';
const config = getConfig();

export const SERIEZER_TRADER_VIEW_INJECT_TOKEN = `SERIEZER_TRADER_VIEW_INJECT_TOKEN`;

const provider = ClientsModule.register([
  {
    name: SERIEZER_TRADER_VIEW_INJECT_TOKEN,
    transport: Transport.NATS,
    options: {
      servers: [`nats://${config.get('nats.host')}:${config.get('nats.port')}`],
    },
  },
]);

@Module({
  imports: [provider],
  exports: [provider],
})
export class NatsClientModule {}
