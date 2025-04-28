import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsMilitaryTime,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideosDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'List of alert types',
    required: false,
    type: [String],
  })
  alert_type: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'List of priorities',
    required: false,
    type: [String],
  })
  priority: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'List of locations',
    required: false,
    type: [String],
  })
  location: string[] = [];

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'Start date', required: false })
  start_date?: Date = undefined;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: 'End date', required: false })
  end_date?: Date = undefined;

  @IsOptional()
  @IsMilitaryTime()
  @ApiProperty({ description: 'Start time', required: false })
  start_time?: Date = undefined;

  @IsOptional()
  @IsMilitaryTime()
  @ApiProperty({ description: 'End time', required: false })
  end_time?: Date = undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Keywords for searching',
    required: false,
    type: [String],
  })
  keywords?: string[];
}
