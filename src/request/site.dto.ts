import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AVAILABLE_VERSIONS, CURRENT_VERSION, LanguageListISO } from '../constant/main.constant';

export class SiteRequest {
  @ApiProperty({
    description: 'Version',
    enum: AVAILABLE_VERSIONS.site,
    example: CURRENT_VERSION.site,
  })
  v: string;

  @ApiProperty({
    required: true,
    description: 'Current language',
    enum: LanguageListISO,
    example: LanguageListISO.en,
  })
  @IsNotEmpty()
  @IsEnum(LanguageListISO)
  language: LanguageListISO = LanguageListISO.en;
}
