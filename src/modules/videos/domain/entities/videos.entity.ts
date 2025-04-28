class ObjectCount {
  [key: string]: number;

  constructor(objectCount: { [key: string]: number }) {
    Object.assign(this, objectCount);
  }
}

class TimeSlot {
  hour: Date;
  video_minute: string;
  object_count: ObjectCount;

  constructor(hour: Date, video_minute: string, object_count: ObjectCount) {
    this.hour = hour;
    this.video_minute = video_minute;
    this.object_count = object_count;
  }
}

class Alert {
  type: string;
  timestamp: Date;

  constructor(type: string, timestamp: Date) {
    this.type = type;
    this.timestamp = timestamp;
  }
}

export class VideoData {
  camera_id: string;
  location: string;
  priority: string;
  video_file: string;
  date: Date;
  timeslots: TimeSlot[];
  alerts: Alert[];

  constructor(
    camera_id: string,
    location: string,
    priority: string,
    video_file: string,
    date: Date,
    timeslots: TimeSlot[],
    alerts: Alert[],
  ) {
    this.camera_id = camera_id;
    this.location = location;
    this.priority = priority;
    this.video_file = video_file;
    this.date = date;
    this.timeslots = timeslots;
    this.alerts = alerts;
  }
}

export class Videos {
  videoData: { [key: string]: VideoData };

  constructor(videoData: { [key: string]: VideoData }) {
    this.videoData = videoData;
  }
}
