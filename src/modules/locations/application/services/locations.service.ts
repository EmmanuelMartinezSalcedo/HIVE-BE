import { Injectable } from '@nestjs/common';
import { Locations } from '../../domain/entities/locations.entity';
import { LocationsRepository } from '../../infrastructure/repositories/locations.repository';

@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepository: LocationsRepository) {}
  async getAllLocations(): Promise<Locations> {
    return await this.locationsRepository.findAll();
  }
}
