import { Module } from '@nestjs/common';
import { VideosService } from './application/services/videos.service';
import { VideosController } from './videos.controller';
import { ConnectionModule } from '../connection/connection.module';
import { VideosRepository } from './infrastructure/repositories/videos.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConnectionModule, HttpModule],
  controllers: [VideosController],
  providers: [VideosService, VideosRepository],
})
export class VideosModule {}
