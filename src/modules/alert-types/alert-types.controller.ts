import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AlertTypesService } from './application/services/alert-types.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('alert-types')
export class AlertTypesController {
  constructor(private readonly alertTypesService: AlertTypesService) {}

  @Get('getAllAlertTypes')
  @ApiOperation({ summary: 'Get all alert types' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved alert types',
    type: [Object],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error.',
  })
  async getAllAlertTypes() {
    try {
      const alertTypes = await this.alertTypesService.getAllAlertTypes();
      return alertTypes;
    } catch (error) {
      Logger.error('Error al obtener los tipos de alerta:', error);
      throw error;
    }
  }
}
