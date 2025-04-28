import { Module } from '@nestjs/common';
import { AlertTypesController } from './alert-types.controller';
import { AlertTypesService } from './application/services/alert-types.service';
import { AlertTypesRepository } from './infrastructure/repositories/alert-types.repository';
import { ConnectionModule } from '../connection/connection.module';

@Module({
  imports: [ConnectionModule],
  controllers: [AlertTypesController],
  providers: [AlertTypesService, AlertTypesRepository],
})
export class AlertTypesModule {}
