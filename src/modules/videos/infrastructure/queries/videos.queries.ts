import { Logger } from '@nestjs/common';

export const VideosQueries = {
  USE_DATABASE: 'USE videos_db',

  GET_VIDEOS: (
    priorities: any = [],
    locations: any = [],
    alertTypes: any = [],
    keywords: any = [],
    start_date?: Date,
    end_date?: Date,
    start_time?: Date,
    end_time?: Date,
  ) => {
    const conditions: string[] = [];

    // Process priorities - handle comma-separated strings properly
    let normalizedPriorities: string[] = [];
    if (Array.isArray(priorities)) {
      normalizedPriorities = priorities;
    } else if (typeof priorities === 'string') {
      normalizedPriorities = priorities.split(',').map((item) => item.trim());
    }

    // Process locations - handle comma-separated strings properly
    let normalizedLocations: string[] = [];
    if (Array.isArray(locations)) {
      normalizedLocations = locations;
    } else if (typeof locations === 'string') {
      normalizedLocations = locations.split(',').map((item) => item.trim());
    }

    // Process alertTypes - handle comma-separated strings properly
    let normalizedAlertTypes: string[] = [];
    if (Array.isArray(alertTypes)) {
      normalizedAlertTypes = alertTypes;
    } else if (typeof alertTypes === 'string') {
      normalizedAlertTypes = alertTypes.split(',').map((item) => item.trim());
    }

    // Process keywords - handle comma-separated strings properly
    let normalizedKeywords: string[] = [];
    if (Array.isArray(keywords)) {
      normalizedKeywords = keywords;
    } else if (typeof keywords === 'string') {
      normalizedKeywords = keywords.split(',').map((item) => item.trim());
    }

    if (normalizedPriorities.length > 0) {
      conditions.push(
        `v.priority IN (${normalizedPriorities.map((p) => `'${p}'`).join(', ')})`,
      );
    }

    if (normalizedLocations.length > 0) {
      conditions.push(
        `v.location IN (${normalizedLocations.map((l) => `'${l}'`).join(', ')})`,
      );
    }

    if (normalizedAlertTypes.length > 0) {
      conditions.push(
        `ale.type IN (${normalizedAlertTypes.map((t) => `'${t}'`).join(', ')})`,
      );
    }

    if (normalizedKeywords.length > 0) {
      conditions.push(
        `oc.object_type IN (${normalizedKeywords.map((k) => `'${k}'`).join(', ')})`,
      );
    }

    if (start_date && end_date) {
      const startDate =
        typeof start_date === 'string' ? new Date(start_date) : start_date;
      const endDate =
        typeof end_date === 'string' ? new Date(end_date) : end_date;

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      if (startDateStr === endDateStr) {
        conditions.push(`v.\`date\` = '${startDateStr}'`);
      } else {
        conditions.push(
          `v.\`date\` BETWEEN '${startDateStr}' AND '${endDateStr}'`,
        );
      }
    }

    if (start_time && end_time) {
      const startTime =
        typeof start_time === 'string' ? new Date(start_time) : start_time;
      const endTime =
        typeof end_time === 'string' ? new Date(end_time) : end_time;

      const startHour = startTime.getHours();
      const endHour = endTime.getHours();

      if (startHour === endHour) {
        conditions.push(`HOUR(ts.\`hour\`) = ${startHour}`);
      } else if (endHour < startHour) {
        conditions.push(
          `(HOUR(ts.\`hour\`) >= ${startHour} OR HOUR(ts.\`hour\`) <= ${endHour})`,
        );
      } else {
        conditions.push(
          `(HOUR(ts.\`hour\`) BETWEEN ${startHour} AND ${endHour})`,
        );
      }
    }

    if (start_time && end_time) {
      conditions.push(`ale.\`timestamp\` = ts.\`hour\``);
    }

    const whereClause =
      conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const query = `
      SELECT v.*, ale.type, ale.\`timestamp\`, ts.\`hour\`, ts.video_minute, oc.object_type, oc.object_count
      FROM videos v
      JOIN alerts ale ON v.video_id = ale.video_id
      JOIN timeslots ts ON v.video_id = ts.video_id
      JOIN object_counts oc ON v.video_id = oc.video_id AND ts.\`hour\` = oc.\`hour\`
      ${whereClause}
    `;

    Logger.log(query);

    return query;
  },
};
