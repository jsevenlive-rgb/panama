import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SiteExperienceAddRequest {
  @ApiProperty()
  @IsString()
  profile_id: string;

  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  position: string;
}
