import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsEnum, IsInt } from 'class-validator';
import { PaginationMetadataStyle } from './pagination.constant';
import { Type } from 'class-transformer';
import { createPagination, getEnumValues } from '../helpers/utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({
    type: 'integer',
    description: 'Page number',
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({
    type: 'integer',
    description: 'Display a limit per page',
  })
  perPage?: number;

  @IsOptional()
  @IsEnum(PaginationMetadataStyle)
  @ApiPropertyOptional({
    type: 'enum',
    enum: getEnumValues(PaginationMetadataStyle),
    description: 'Pagination style: Header/Body, leave default as header',
  })
  paginationMetadataStyle?: PaginationMetadataStyle;
}

export const Pagination = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return createPagination(req.query.page, req.query.perPage);
});
