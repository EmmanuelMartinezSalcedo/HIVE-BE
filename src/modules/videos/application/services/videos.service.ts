import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VideosRepository } from '../../infrastructure/repositories/videos.repository';
import { VideosDto } from '../dto/videos.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class VideosService {
  constructor(
    private readonly videosRepository: VideosRepository,
    private readonly httpService: HttpService,
  ) {}
  async getVideos(videosDto: VideosDto) {
    const adjustedDto: VideosDto = {
      ...videosDto,
      alert_type: videosDto.alert_type || [],
      priority: videosDto.priority || [],
      location: videosDto.location || [],
      keywords: videosDto.keywords || [],
      start_date: videosDto.start_date || videosDto.end_date || undefined,
      end_date: videosDto.end_date || videosDto.start_date || undefined,
      start_time: videosDto.start_time || videosDto.end_time || undefined,
      end_time: videosDto.end_time || videosDto.start_time || undefined,
    };

    if (
      adjustedDto.start_date &&
      adjustedDto.end_date &&
      new Date(adjustedDto.start_date) > new Date(adjustedDto.end_date)
    ) {
      throw new BadRequestException(
        'start_date no puede ser después de end_date.',
      );
    }

    if (
      adjustedDto.start_time &&
      adjustedDto.end_time &&
      new Date(adjustedDto.start_time) > new Date(adjustedDto.end_time)
    ) {
      throw new BadRequestException(
        'start_time no puede ser después de end_time.',
      );
    }

    return await this.videosRepository.find(adjustedDto);
  }

  async getFileFromHDFS(
    path: string,
    host: string = 'localhost',
    port: number = 9864,
    offset?: number,
    length?: number,
    bufferSize?: number,
    namenoderpcaddress: string = 'namenode:8020',
  ) {
    const url = `http://${host}:${port}/webhdfs/v1/${path}?op=OPEN&namenoderpcaddress=${namenoderpcaddress}${
      offset ? `&offset=${offset}` : ''
    }${length ? `&length=${length}` : ''}${bufferSize ? `&buffersize=${bufferSize}` : ''}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error making the request', error);
      throw error;
    }
  }

  async getVideoByPath(filePath: string, res: Response) {
    try {
      const videoBuffer = await this.getFileFromHDFS(filePath);

      res.set({
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length.toString(),
        'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
      });

      res.send(videoBuffer);
    } catch (error) {
      console.error('Error fetching video file:', error);
      throw new BadRequestException('No se pudo obtener el archivo de video.');
    }
  }
}
