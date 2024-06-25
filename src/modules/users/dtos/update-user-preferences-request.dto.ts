import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateUserPreferencesRequestDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'List of category ids',
    example: [1, 2, 3],
    isArray: true,
  })
  category_ids: number[];
}
