import { Injectable } from '@nestjs/common';
import { ConnectionService } from '../../../connection/application/services/connection.service';
import { Locations } from '../../domain/entities/locations.entity';
import { LocationsQueries } from '../queries/locations.queries';

@Injectable()
export class LocationsRepository {
  constructor(private readonly connectionService: ConnectionService) {}

  async findAll(): Promise<Locations> {
    try {
      await this.connectionService.connectHive();

      await this.connectionService.executeQueryHive(
        LocationsQueries.USE_DATABASE,
      );

      const result = await this.connectionService.executeQueryHive(
        LocationsQueries.GET_ALL_LOCATIONS,
      );

      const locationsArray = result.map((row) => row.location);

      await this.connectionService.closeConnectionHive();

      return { locations: locationsArray };
    } catch (error) {
      this.connectionService.closeConnectionHive();
      throw new Error('Error en LocationsRepository: ' + error.message);
    }
  }
}
