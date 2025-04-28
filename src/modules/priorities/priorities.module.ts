import { Module } from '@nestjs/common';
import { PrioritiesController } from './priorities.controller';
import { PrioritiesService } from './application/services/priorities.service';
import { PrioritiesRepository } from './infrastructure/repositories/priorities.repository';
import { ConnectionModule } from '../connection/connection.module';

@Module({
  imports: [ConnectionModule],
  controllers: [PrioritiesController],
  providers: [PrioritiesService, PrioritiesRepository],
})
export class PrioritiesModule {}
