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
    let priorityCondition = '';
    let locationCondition = '';
    let alertTypeCondition = '';
    let keywordCondition = '';
    let dateCondition = '';
    let timeCondition = '';

    const normalizedPriorities = Array.isArray(priorities)
      ? priorities
      : typeof priorities === 'string'
        ? [priorities]
        : [];
    const normalizedLocations = Array.isArray(locations)
      ? locations
      : typeof locations === 'string'
        ? [locations]
        : [];
    const normalizedAlertTypes = Array.isArray(alertTypes)
      ? alertTypes
      : typeof alertTypes === 'string'
        ? [alertTypes]
        : [];
    const normalizedKeywords = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
        ? [keywords]
        : [];

    if (normalizedPriorities.length > 0) {
      priorityCondition = `WHERE v.priority IN ('${normalizedPriorities.join("', '")}')`;
    }

    if (normalizedLocations.length > 0) {
      if (priorityCondition) {
        locationCondition = `AND v.location IN ('${normalizedLocations.join("', '")}')`;
      } else {
        locationCondition = `WHERE v.location IN ('${normalizedLocations.join("', '")}')`;
      }
    }

    if (normalizedAlertTypes.length > 0) {
      if (priorityCondition || locationCondition) {
        alertTypeCondition = `AND ale.type IN ('${normalizedAlertTypes.join("', '")}')`;
      } else {
        alertTypeCondition = `WHERE ale.type IN ('${normalizedAlertTypes.join("', '")}')`;
      }
    }

    if (normalizedKeywords.length > 0) {
      if (priorityCondition || locationCondition || alertTypeCondition) {
        keywordCondition = `AND oc.object_type IN ('${normalizedKeywords.join("', '")}')`;
      } else {
        keywordCondition = `WHERE oc.object_type IN ('${normalizedKeywords.join("', '")}')`;
      }
    }

    if (start_date && end_date) {
      let startDate = start_date;
      let endDate = end_date;

      if (startDate && typeof startDate === 'string') {
        startDate = new Date(startDate);
      }

      if (endDate && typeof endDate === 'string') {
        endDate = new Date(endDate);
      }

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      if (startDateStr === endDateStr) {
        if (priorityCondition || locationCondition || alertTypeCondition) {
          dateCondition = `AND v.\`date\` = '${startDateStr}'`;
        } else {
          dateCondition = `WHERE v.\`date\` = '${startDateStr}'`;
        }
      } else {
        if (priorityCondition || locationCondition || alertTypeCondition) {
          dateCondition = `AND v.\`date\` BETWEEN '${startDateStr}' AND '${endDateStr}'`;
        } else {
          dateCondition = `WHERE v.\`date\` BETWEEN '${startDateStr}' AND '${endDateStr}'`;
        }
      }
    }

    if (!start_date && !end_date) {
      dateCondition = '';
    }

    if (start_time && end_time) {
      let startTime = start_time;
      let endTime = end_time;

      if (typeof startTime === 'string') {
        startTime = new Date(startTime);
      }

      if (typeof endTime === 'string') {
        endTime = new Date(endTime);
      }

      const startHour = startTime.getHours();
      const endHour = endTime.getHours();

      const prefix =
        priorityCondition ||
        locationCondition ||
        alertTypeCondition ||
        dateCondition ||
        keywordCondition
          ? 'AND'
          : 'WHERE';

      if (startHour === endHour) {
        timeCondition = `${prefix} HOUR(ts.\`hour\`) = ${startHour}`;
      } else {
        if (endHour < startHour) {
          timeCondition = `${prefix} (HOUR(ts.\`hour\`) >= ${startHour} OR HOUR(ts.\`hour\`) <= ${endHour})`;
        } else {
          timeCondition = `${prefix} (HOUR(ts.\`hour\`) BETWEEN ${startHour} AND ${endHour})`;
        }
      }
    }

    Logger.log(
      `
      SELECT v.*, ale.type, ale.\`timestamp\`, ts.\`hour\`, ts.video_minute, oc.object_type, oc.object_count
      FROM videos v
      JOIN alerts ale ON v.video_id = ale.video_id
      JOIN timeslots ts ON v.video_id = ts.video_id
      JOIN object_counts oc ON v.video_id = oc.video_id AND ts.\`hour\` = oc.\`hour\`
      ${priorityCondition}
      ${locationCondition}
      ${alertTypeCondition}
      ${keywordCondition}
      ${dateCondition}
      ${timeCondition}
      ${timeCondition ? 'AND ale.\`timestamp\` = ts.\`hour\`' : ''}
      `,
    );

    return `
      SELECT v.*, ale.type, ale.\`timestamp\`, ts.\`hour\`, ts.video_minute, oc.object_type, oc.object_count
      FROM videos v
      JOIN alerts ale ON v.video_id = ale.video_id
      JOIN timeslots ts ON v.video_id = ts.video_id
      JOIN object_counts oc ON v.video_id = oc.video_id AND ts.\`hour\` = oc.\`hour\`
      ${priorityCondition}
      ${locationCondition}
      ${alertTypeCondition}
      ${keywordCondition}
      ${dateCondition}
      ${timeCondition}
      ${timeCondition ? 'AND ale.\`timestamp\` = ts.\`hour\`' : ''}
    `;
  },
};
