import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { withListResponse } from '../response/listResponse';

export const ApiListDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(withListResponse),
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `ListOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(withListResponse) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
            required: ['results'],
          },
        ],
      },
    })
  );
};
