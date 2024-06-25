import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserResponseDto } from 'src/modules/users/dtos/user-response.dto';

@Expose()
export class UpdateUserRequestDto extends PartialType(
  PickType(UserResponseDto, ['firstName', 'lastName', 'avatar', 'address']),
) {}

@Expose()
export class UpdateUserFirstTimeRequestDto {
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    type: String,
    name: 'full_name',
    description: 'Full name of user',
  })
  full_name: string;

  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    type: String,
    name: 'password',
    description: 'Full name of user',
  })
  password: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: String,
    name: 'avatar',
    description: 'Avatar of user',
  })
  avatar?: string;
}
