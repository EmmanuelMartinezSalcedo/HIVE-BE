import { Module } from '@nestjs/common';
import { ConnectionService } from './application/services/connection.service';

@Module({
  controllers: [],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
