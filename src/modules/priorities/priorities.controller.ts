import { Controller, Get, Logger } from '@nestjs/common';
import { PrioritiesService } from './application/services/priorities.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('priorities')
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Get('getAllPriorities')
  @ApiOperation({ summary: 'Get all priorities' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved priorities.',
    type: [Object],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error.',
  })
  async getAllPriorities() {
    try {
      const priorities = await this.prioritiesService.getAllPriorities();
      return priorities;
    } catch (error) {
      Logger.error('Error al obtener los tipos de alerta:', error);
      throw error;
    }
  }
}
