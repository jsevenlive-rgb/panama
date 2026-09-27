import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SiteProjectAddRequest {
  @ApiProperty()
  @IsString()
  profile_id: string;

  @ApiProperty()
  @IsString()
  name: string;
}
