import { OpenAPIObject } from '@nestjs/swagger';
import {
  GraphQLEnumType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  isEnumType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
} from 'graphql';

const SKIP_TYPES = new Set(['Query', 'Mutation', 'Subscription']);

export function graphqlSchemaToOpenApi(schema: GraphQLSchema): OpenAPIObject {
  const schemas: OpenAPIObject['components']['schemas'] = {};

  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__') || SKIP_TYPES.has(type.name)) continue;
    if (isObjectType(type)) {
      schemas[type.name] = objectSchema(type);
    } else if (isEnumType(type)) {
      schemas[type.name] = enumSchema(type);
    }
  }

  const dataProperties: Record<string, unknown> = {};
  const selections: string[] = [];
  const query = schema.getQueryType();
  if (query) {
    for (const field of Object.values(query.getFields())) {
      dataProperties[field.name] = toSchema(field.type);
      selections.push(exampleSelection(field.name, field.type, new Set(), 0));
    }
  }

  const exampleQuery = `query {\n${selections.map((selection) => indent(selection, 1)).join('\n')}\n}`;

  return {
    openapi: '3.0.0',
    info: {
      title: 'Backend',
      description: 'GraphQL API',
      version: '3',
    },
    paths: {
      '/graphql': {
        post: {
          operationId: 'graphql',
          summary: 'GraphQL',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: { type: 'string', example: exampleQuery },
                    variables: { type: 'object', additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'GraphQL response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: dataProperties,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: { schemas },
  };
}

function objectSchema(type: GraphQLObjectType) {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const field of Object.values(type.getFields())) {
    properties[field.name] = toSchema(field.type);
    if (isNonNullType(field.type)) required.push(field.name);
  }

  return {
    type: 'object' as const,
    properties,
    ...(required.length ? { required } : {}),
  };
}

function enumSchema(type: GraphQLEnumType) {
  return {
    type: 'string' as const,
    enum: type.getValues().map((value) => value.name),
  };
}

function toSchema(type: GraphQLOutputType): Record<string, unknown> {
  const { named, list, required } = unwrap(type);
  let schema: Record<string, unknown>;

  if (isScalarType(named)) {
    schema = { type: scalarType(named.name) };
  } else if (isObjectType(named) || isEnumType(named)) {
    schema = { $ref: `#/components/schemas/${named.name}` };
  } else {
    schema = { type: 'object' };
  }

  if (list) schema = { type: 'array', items: schema };
  if (!required) schema = { ...schema, nullable: true };
  return schema;
}

function unwrap(type: GraphQLOutputType): { named: GraphQLNamedType; list: boolean; required: boolean } {
  let required = false;
  let list = false;
  let current = type;

  if (isNonNullType(current)) {
    required = true;
    current = current.ofType;
  }
  if (isListType(current)) {
    list = true;
    current = current.ofType;
    if (isNonNullType(current)) current = current.ofType;
  }
  if (isListType(current) || isNonNullType(current)) {
    return { ...unwrap(current), list: true, required };
  }

  return { named: current, list, required };
}

function scalarType(name: string): string {
  switch (name) {
    case 'Int':
      return 'integer';
    case 'Float':
      return 'number';
    case 'Boolean':
      return 'boolean';
    default:
      return 'string';
  }
}

function exampleSelection(fieldName: string, type: GraphQLOutputType, seen: Set<string>, depth: number): string {
  const { named } = unwrap(type);
  if (!isObjectType(named) || depth > 4 || seen.has(named.name)) return fieldName;

  const next = new Set(seen);
  next.add(named.name);
  const inner = Object.values(named.getFields())
    .map((field) => exampleSelection(field.name, field.type, next, depth + 1))
    .join('\n');

  return `${fieldName} {\n${indent(inner, 1)}\n}`;
}

function indent(value: string, level: number): string {
  const pad = '  '.repeat(level);
  return value
    .split('\n')
    .map((line) => `${pad}${line}`)
    .join('\n');
}
