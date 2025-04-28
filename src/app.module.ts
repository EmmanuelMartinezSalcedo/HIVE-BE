import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosController } from './modules/videos/videos.controller';
import { VideosModule } from './modules/videos/videos.module';
import { AlertTypesModule } from './modules/alert-types/alert-types.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { PrioritiesModule } from './modules/priorities/priorities.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [
    VideosModule,
    AlertTypesModule,
    ConnectionModule,
    PrioritiesModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
