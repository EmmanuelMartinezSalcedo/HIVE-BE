import { Injectable, Logger } from '@nestjs/common';

import * as hive from 'hive-driver';
const { TCLIService, TCLIService_types } = hive.thrift;
const utils = new hive.HiveUtils(TCLIService_types);

@Injectable()
export class ConnectionService {
  private client: any;
  private session: any;

  constructor() {
    this.client = new hive.HiveClient(TCLIService, TCLIService_types);
  }

  async connectHive(): Promise<void> {
    try {
      const client = await this.client.connect(
        {
          host: 'localhost',
          port: 10000,
        },
        new hive.connections.TcpConnection(),
        new hive.auth.PlainTcpAuthentication(),
      );

      this.client = client;

      this.session = await this.client.openSession({
        client_protocol:
          TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
      });

      Logger.log('Conexión establecida y sesión abierta con éxito');
    } catch (error) {
      Logger.error('Error al conectar a Hive:', error);
      throw error;
    }
  }

  async closeConnectionHive(): Promise<void> {
    try {
      if (this.session) {
        await this.session.close();
        Logger.log('Sesión cerrada con éxito');
      }

      await this.client.close();
      Logger.log('Conexión cerrada con éxito');
    } catch (error) {
      Logger.error('Error al cerrar la conexión:', error);
      throw error;
    }
  }

  async executeQueryHive(query: string): Promise<any> {
    try {
      if (!this.session) {
        throw new Error('No se ha abierto una sesión');
      }

      const operation = await this.session.executeStatement(query, {
        runAsync: true,
      });

      await utils.waitUntilReady(operation, false, () => {});
      await utils.fetchAll(operation);

      await operation.close();
      const result = utils.getResult(operation).getValue();

      return result;
    } catch (error) {
      Logger.error('Error al ejecutar la consulta:', error);
      throw error;
    }
  }
}
