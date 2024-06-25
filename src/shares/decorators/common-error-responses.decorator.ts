import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ErrorResponse {
  @ApiModelPropertyOptional({ type: Number })
  readonly status?: any;
  @ApiModelPropertyOptional({
    type: String,
    example: 'Error message',
    default: 'Internal Server Error',
  })
  readonly message?: any;
  @ApiModelPropertyOptional({ type: String, example: 'Error' })
  readonly name?: any;
}

export const CommonErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: 'Service unavailable',
      type: ErrorResponse,
    }),
  );
};
