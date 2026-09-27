import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SiteExperienceIdRequest {
  @ApiProperty()
  @IsString()
  _id: string;
}
