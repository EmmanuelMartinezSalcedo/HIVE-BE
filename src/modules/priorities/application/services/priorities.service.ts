import { Injectable } from '@nestjs/common';
import { Priorities } from '../../domain/entities/priorities.entity';
import { PrioritiesRepository } from '../../infrastructure/repositories/priorities.repository';

@Injectable()
export class PrioritiesService {
  constructor(private readonly prioritiesRepository: PrioritiesRepository) {}
  async getAllPriorities(): Promise<Priorities> {
    return await this.prioritiesRepository.findAll();
  }
}
