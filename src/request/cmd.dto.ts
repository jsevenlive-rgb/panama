import { ApiProperty } from '@nestjs/swagger';
import { AVAILABLE_VERSIONS, CURRENT_VERSION } from '../constant/main.constant';
import { IsNotEmpty } from 'class-validator';

export class CmdRequest {
  @ApiProperty({
    description: 'Version',
    type: String,
    enum: AVAILABLE_VERSIONS.cmd,
    example: CURRENT_VERSION.cmd,
  })
  @IsNotEmpty()
  v: string;
}
