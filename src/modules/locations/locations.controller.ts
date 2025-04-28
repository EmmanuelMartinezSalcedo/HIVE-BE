import { Controller, Get, Logger, Query } from '@nestjs/common';
import { LocationsService } from './application/services/locations.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('getAllLocations')
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved locations',
    type: [Object],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error.',
  })
  async getAllLocations() {
    try {
      const locations = await this.locationsService.getAllLocations();
      return locations;
    } catch (error) {
      Logger.error('Error al obtener las locaciones:', error);
      throw error;
    }
  }
}
