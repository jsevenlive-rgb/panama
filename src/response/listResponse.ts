import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { mixin } from '@nestjs/common';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

type Constructor<T = object> = new (...args: any[]) => T;
// Этот класс необходимо применять вместо ListResponse.
// Детали тут: https://www.inextenso.dev/how-to-generate-generic-dtos-with-nestjs-and-swagger
export function withListResponse<TBase extends Constructor>(Base: TBase, options?: ApiPropertyOptions | undefined) {
  class ListResponseGeneric {
    @ApiProperty({
      isArray: true,
      type: Base,
      ...options,
    })
    @Type(() => Base)
    @ValidateNested({ each: true })
    results!: Array<InstanceType<TBase>>;
  }
  return mixin(ListResponseGeneric);
}

/**
 * Это неверный класс, применение которого приводит к ошибкам.
 * Его нельзя использовать.
 * @deprecated Используй withListResponse вместо этого
 */
export class ListResponse<TData> {
  @ApiProperty({
    description: 'Array of items',
    required: true,
  })
  results: TData[];
}
