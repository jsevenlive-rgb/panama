import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SiteExperienceUpdateRequest {
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
  company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  position?: string;
}
