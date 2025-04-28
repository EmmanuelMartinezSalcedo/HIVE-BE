import { Injectable } from '@nestjs/common';
import { ConnectionService } from '../../../connection/application/services/connection.service';
import { VideosQueries } from '../queries/videos.queries';
import { VideosDto } from '../../application/dto/videos.dto';

@Injectable()
export class VideosRepository {
  constructor(private readonly connectionService: ConnectionService) {}

  async find(videos: VideosDto): Promise<any> {
    await this.connectionService.connectHive();

    try {
      await this.connectionService.executeQueryHive(VideosQueries.USE_DATABASE);

      const result = await this.connectionService.executeQueryHive(
        VideosQueries.GET_VIDEOS(
          videos.priority,
          videos.location,
          videos.alert_type,
          videos.keywords,
          videos.start_date,
          videos.end_date,
          videos.start_time,
          videos.end_time,
        ),
      );

      const videosMap = {};

      result.forEach((row) => {
        const videoKey = `${row.location}_${row.camera_id}_${row.date}`;

        if (!videosMap[videoKey]) {
          videosMap[videoKey] = {
            camera_id: row.camera_id,
            location: row.location,
            priority: row.priority,
            video_file: row.video_file,
            date: row.date,
            timeslots: [],
            alerts: [],
          };
        }

        let timeslot = videosMap[videoKey].timeslots.find(
          (t) => t.hour === row.hour,
        );

        if (!timeslot) {
          timeslot = {
            hour: row.hour,
            video_minute: row.video_minute,
            object_count: {},
          };
          videosMap[videoKey].timeslots.push(timeslot);
        }

        if (row.object_type) {
          if (timeslot.object_count[row.object_type]) {
            timeslot.object_count[row.object_type] += row.object_count;
          } else {
            timeslot.object_count[row.object_type] = row.object_count;
          }
        }

        if (row.type && row.timestamp) {
          const existsAlert = videosMap[videoKey].alerts.some(
            (alert) =>
              alert.type === row.type && alert.timestamp === row.timestamp,
          );

          if (!existsAlert) {
            videosMap[videoKey].alerts.push({
              type: row.type,
              timestamp: row.timestamp,
            });
          }
        }
      });

      const videosArrayMapped = Object.values(videosMap);

      await this.connectionService.closeConnectionHive();

      return { videoData: videosArrayMapped };
    } catch (error) {
      await this.connectionService.closeConnectionHive();
      throw new Error('Error en VideosRepository: ' + error.message);
    }
  }
}
