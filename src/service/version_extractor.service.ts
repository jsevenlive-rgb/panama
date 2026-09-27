import { BadRequestException } from '@nestjs/common';

export const extractor = (request: any): string | string[] => {
  const url = request.url?.split('?')[0] ?? '';
  if (url.startsWith('/graphql') || url.startsWith('/apidoc')) {
    return '1';
  }

  /*if (request.url) {
      let path = request.url.split('/');
      console.log(path[1]);
    }*/
  let requestedVersion: string;
  requestedVersion =
    request.query && typeof request.query === 'object' && request.query['v'] ? request.query['v'] : null;

  if (!requestedVersion) requestedVersion = <string>request.headers['x-api-version'];

  if (!requestedVersion && request.body)
    requestedVersion = request.body && typeof request.body === 'object' && request.body['v'] ? request.body['v'] : null;

  if (!requestedVersion) throw new BadRequestException('Version not provided');

  // If requested version is N, then this generates an array like: ['N', 'N-1', 'N-2', ... , '1']

  return requestedVersion.toString();

  // Работает нормально только с fastify
  /*
    return Array.from(
        { length: parseInt(requestedVersion) },
        (_, i) => `${i + 1}`,
    ).reverse();*/
};
