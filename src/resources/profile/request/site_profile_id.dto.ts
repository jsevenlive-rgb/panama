import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SiteProfileIdRequest {
  @ApiProperty()
  @IsString()
  _id: string;
}
