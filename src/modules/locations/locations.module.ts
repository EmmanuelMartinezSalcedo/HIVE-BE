import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './application/services/locations.service';
import { LocationsRepository } from './infrastructure/repositories/locations.repository';
import { ConnectionModule } from '../connection/connection.module';

@Module({
  imports: [ConnectionModule],
  controllers: [LocationsController],
  providers: [LocationsService, LocationsRepository],
})
export class LocationsModule {}
