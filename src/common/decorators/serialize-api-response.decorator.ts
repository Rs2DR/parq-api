import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { createSchema } from 'zod-openapi';
import z from 'zod';

interface SerializeApiResponseOptions {
  status?: HttpStatus;
  schema: z.ZodType;
  description?: string;
}

export function SerializeApiResponse({
  status = HttpStatus.OK,
  schema,
  description = 'Success response',
}: SerializeApiResponseOptions) {
  const converted = createSchema(schema, {
    io: 'output',
    openapiVersion: '3.0.0',
  });

  return applyDecorators(
    HttpCode(status),
    SerializeOptions({ schema }),
    ApiResponse({ status, schema: converted.schema as any, description }),
  );
}
