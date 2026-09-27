import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SiteProjectIdRequest {
  @ApiProperty()
  @IsString()
  _id: string;
}
