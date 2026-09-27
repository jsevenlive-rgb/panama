import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { mixin } from '@nestjs/common';

type Constructor<T = object> = new (...args: any[]) => T;
// Этот класс необходимо применять вместо PaginatedResponse.
// Детали тут: https://www.inextenso.dev/how-to-generate-generic-dtos-with-nestjs-and-swagger
export function withPaginatedResponse<TBase extends Constructor>(
  Base: TBase,
  options?: ApiPropertyOptions | undefined
) {
  class PaginateResponseGeneric {
    @IsInt()
    @ApiProperty({
      type: Number,
      description: 'Общее количество элементов вообще',
    })
    total!: number;

    @IsInt()
    @ApiProperty({
      type: Number,
      description: 'Размер запрашиваемой страницы',
    })
    limit!: number;

    @IsInt()
    @ApiProperty({
      type: Number,
      description: 'С какого элемента включительно делать запрос',
    })
    offset!: number;

    @ApiProperty({
      isArray: true,
      type: Base,
      ...options,
    })
    @Type(() => Base)
    @ValidateNested({ each: true })
    results!: Array<InstanceType<TBase>>;
  }
  return mixin(PaginateResponseGeneric);
}

/**
 * Это неверный класс, применение которого приводит к ошибкам.
 * Его нельзя использовать.
 * @deprecated Используй withPaginatedResponse вместо этого
 */
export class PaginatedResponse<TData> {
  @ApiProperty()
  @IsInt()
  total: number;

  @ApiProperty()
  @IsInt()
  limit: number;

  @ApiProperty()
  @IsInt()
  offset: number;

  @ApiProperty()
  results: TData[];
}
