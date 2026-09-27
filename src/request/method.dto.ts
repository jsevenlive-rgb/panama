import { ApiProperty } from '@nestjs/swagger';
import { AVAILABLE_VERSIONS, CURRENT_VERSION, LanguageListISO } from '../constant/main.constant';

export class MethodRequest {
  @ApiProperty({
    description: 'Version',
    type: String,
    enum: AVAILABLE_VERSIONS.method,
    example: CURRENT_VERSION.method,
  })
  v: string;

  @ApiProperty({
    required: false,
    description: 'Current language',
    enum: LanguageListISO,
    default: LanguageListISO.en,
  })
  language?: LanguageListISO = LanguageListISO.en;
}
