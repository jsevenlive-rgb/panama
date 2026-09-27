import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { withPaginatedResponse } from '../response/paginated.dto';

export const ApiPaginatedDto = <TModel extends Type>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(withPaginatedResponse),
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(withPaginatedResponse) },
          {
            properties: {
              total: { type: 'number' },
              limit: { type: 'number' },
              offset: { type: 'number' },
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
            required: ['total', 'limit', 'offset', 'results'],
          },
        ],
      },
    })
  );
};
