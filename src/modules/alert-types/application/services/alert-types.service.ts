import { Injectable } from '@nestjs/common';
import { AlertTypes } from '../../domain/entities/alert-types.entity';
import { AlertTypesRepository } from '../../infrastructure/repositories/alert-types.repository';

@Injectable()
export class AlertTypesService {
  constructor(private readonly alertTypesRepository: AlertTypesRepository) {}
  async getAllAlertTypes(): Promise<AlertTypes> {
    return await this.alertTypesRepository.findAll();
  }
}
