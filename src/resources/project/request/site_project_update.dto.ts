import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SiteProjectUpdateRequest {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profile_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
