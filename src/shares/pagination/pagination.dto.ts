import { IsOptional, IsNumberString, IsEnum, IsInt } from 'class-validator';
import { PaginationMetadataStyle } from './pagination.constant';
import { Type } from 'class-transformer';
import { createPagination } from '../helpers/utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  perPage?: number;

  @IsOptional()
  @IsEnum(PaginationMetadataStyle)
  paginationMetadataStyle?: PaginationMetadataStyle;
}

export const Pagination = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return createPagination(req.query.page, req.query.perPage);
});
