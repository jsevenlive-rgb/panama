import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({
    description: 'Response execution success',
  })
  success = true;
}
