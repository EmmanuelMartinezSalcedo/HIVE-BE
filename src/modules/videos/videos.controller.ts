import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { VideosService } from './application/services/videos.service';
import { Response } from 'express';
import { VideosDto } from './application/dto/videos.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('getVideos')
  @ApiOperation({ summary: 'Get videos' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved videos.',
    type: [Object],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error.',
  })
  async getVideos(@Query() videosDto: VideosDto) {
    try {
      Logger.log('Objeto recibido en getVideos:', JSON.stringify(videosDto));

      const videos = await this.videosService.getVideos(videosDto);
      return videos;
    } catch (error) {
      Logger.error('Error al obtener los videos:', error);
      throw error;
    }
  }

  @Get('getVideoFile')
  @ApiOperation({ summary: 'Get video file by path' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved video file.',
    type: [Object],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error.',
  })
  async getVideoFile(
    @Query('filePath') filePath: string,
    @Res() res: Response,
  ) {
    try {
      if (!filePath) {
        throw new BadRequestException('File path is required');
      }

      await this.videosService.getVideoByPath(filePath, res);
    } catch (error) {
      Logger.error('Error al obtener el archivo de video:', error);
      throw new BadRequestException('No se pudo obtener el archivo de video.');
    }
  }
}
