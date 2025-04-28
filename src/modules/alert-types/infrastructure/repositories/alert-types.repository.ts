import { Injectable } from '@nestjs/common';
import { ConnectionService } from '../../../connection/application/services/connection.service';
import { AlertTypes } from '../../domain/entities/alert-types.entity';
import { AlertTypesQueries } from '../queries/alert-types.queries';

@Injectable()
export class AlertTypesRepository {
  constructor(private readonly connectionService: ConnectionService) {}

  async findAll(): Promise<AlertTypes> {
    try {
      await this.connectionService.connectHive();

      await this.connectionService.executeQueryHive(
        AlertTypesQueries.USE_DATABASE,
      );

      const result = await this.connectionService.executeQueryHive(
        AlertTypesQueries.GET_ALL_ALERT_TYPES,
      );

      const alertTypesArray = result.map((row) => row.alert_type);

      await this.connectionService.closeConnectionHive();

      return { alert_types: alertTypesArray };
    } catch (error) {
      throw new Error('Error en AlertTypesRepository: ' + error.message);
    }
  }
}
