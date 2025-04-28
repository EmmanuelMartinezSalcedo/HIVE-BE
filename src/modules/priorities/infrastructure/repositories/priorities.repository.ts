import { Injectable } from '@nestjs/common';
import { ConnectionService } from '../../../connection/application/services/connection.service';
import { Priorities } from '../../domain/entities/priorities.entity';
import { PrioritiesQueries } from '../queries/priorities.queries';

@Injectable()
export class PrioritiesRepository {
  constructor(private readonly connectionService: ConnectionService) {}

  async findAll(): Promise<Priorities> {
    await this.connectionService.connectHive();

    try {
      await this.connectionService.executeQueryHive(
        PrioritiesQueries.USE_DATABASE,
      );

      const result = await this.connectionService.executeQueryHive(
        PrioritiesQueries.GET_ALL_PRIORITIES,
      );

      const prioritiesArray = result.map((row) => row.priority);

      await this.connectionService.closeConnectionHive();

      return { priorities: prioritiesArray };
    } catch (error) {
      this.connectionService.closeConnectionHive();
      throw new Error('Error en PrioritiesRepository: ' + error.message);
    }
  }
}
